"use strict"

import {mmu} from "./mmu.js"
import {cpu} from "./cpu.js"
import {screen} from "./screen.js"

export let gpu = {
    vram: new Array(0x2000),
    oam: new Array(0x9F),   // Object Attribute
    clock: {
        frame_cycles: 0,
        scanline_cycles: 0
    },
    mode: 2,
    line: 0,
    vblank: false,
    tile_cache: [],
    frame_buffer: new Array(160 * 144),
    bg_buffer: new Array(256 * 256),


}

// TileEntry (for Tile Cache)
class TileEntry {
    dirty = true
    pixels = new Array(64)
}

/*
    Macros
*/
const OAM_PERIOD = 80
const TRANSFER_PERIOD = OAM_PERIOD + 172
const HBLANK_PERIOD = 456
const FRAME_PERIOD = 144 * HBLANK_PERIOD
const VBLANK_PERIOD = FRAME_PERIOD + 4560

// Address Macros
const STAT = 0xFF41
// Viewport Addresses
const SCX = 0xFF43    // X Pos of BG
const SCY = 0xFF42    // Y Pos of BG
const WINX = 0xFF4B   // X Pos of Viewing Area, BG + 7 !
const WINY = 0xFF4A   // Y Pos of Viewing Area
const LY = 0xFF44
const LYC = 0xFF45
const BGP = 0xFF47  // Background Palette

gpu.reset = () => {
    gpu.clock.frame_cycles = 0
    gpu.clock.scanline_cycles = 0

    for (let i = 0; i < 384; i++) {
        let tile = new TileEntry()
        gpu.tile_cache.push(tile)
    }
}

gpu.update = (cycles) => {

    let LCDC = mmu.io_reg[0xFF40 - 0xFF00] //gpu.read(0xFF40)
    //console.log(`LCDC Bit 7: ${(LCDC & (1 << 7)).toString(16)} ${LCDC}`)
    if (!(LCDC & (1 << 7))) return

    console.warn("LCDC Enabled: Updating GPU")

    let request = false
    gpu.clock.frame_cycles += cycles
    gpu.clock.scanline_cycles += cycles
    let old_mode = gpu.mode
    gpu.vblank = false

    if (gpu.clock.frame_cycles > FRAME_PERIOD) {
        gpu.vblank = true
        if (old_mode !== 1) {
            gpu.setMode(1)    // We are in VBLANK
            cpu.requestInterrupt(0)
            request = (gpu.read(STAT) & (1 << 4))
        }

        if (gpu.clock.frame_cycles > VBLANK_PERIOD) {
            gpu.clock.scanline_cycles = 0
            gpu.clock.frame_cycles = 0
            gpu.write(0x0, LY)   // Clear LY
            gpu.setMode(2)  // Searching OAM
        }
    } else {

        if (gpu.clock.scanline_cycles >= 0 && gpu.clock.scanline_cycles <= OAM_PERIOD) {
            if (old_mode !== 2) {
                gpu.setMode(2)  // Searching OAM
                request = (gpu.read(STAT) & (1 << 5))
            }

        } else if (gpu.clock.scanline_cycles >= OAM_PERIOD && gpu.clock.scanline_cycles <= TRANSFER_PERIOD) {
            if (old_mode !== 3) {
                gpu.setMode(3)  // Transfer Data to LCD
                console.log("Update Scanline")
                gpu.update_scanline()
            }

        } else if (gpu.clock.scanline_cycles >= TRANSFER_PERIOD && gpu.clock.scanline_cycles <= HBLANK_PERIOD) {
            if (old_mode !== 0) {
                gpu.setMode(0)  // HBLANK
                request = gpu.read(STAT) & (1 << 3)
            }
        }
    }

    if (request) {
        cpu.requestInterrupt(1)
    }

    if (gpu.clock.scanline_cycles > HBLANK_PERIOD) {
        let newLY = gpu.read(LY)
        newLY = (newLY + 1) % 256
        gpu.write(newLY, LY)
        gpu.clock.scanline_cycles = 0
        gpu.line_compare()
    }
}

gpu.line_compare = () => {

    let temp_stat = gpu.read(STAT)

    if (gpu.read(LY) === gpu.read(LYC)) {
        temp_stat |= (1 << 2)
        cpu.requestInterrupt(1)
    } else {
        temp_stat = temp_stat & 0b11111011
    }
    gpu.write(temp_stat, STAT)
}

gpu.setMode = (mode) => {
    gpu.mode = mode
    let newSTAT = gpu.read(STAT)
    newSTAT &= 0xFC
    newSTAT |= mode
    gpu.write(newSTAT, STAT)

}

gpu.update_scanline = () => {
    let LCDC = gpu.read(0xFF40)

    if (LCDC & 0x1) {    // 0b0000 0001
        gpu.draw_background()
    }
    if (LCDC & 0x2) {    // 0b0000 0010
        gpu.draw_sprites()
    }
    if (LCDC & 0x20) {   // 0b0010 0000
        gpu.draw_window()
    }
}

gpu.read_tile_data = (index, startAddr) => {
    let tile_size = 0x10 // 16 Bytes
    //let line = mmu.read(gpu.LY)
    let data = []

    let start = index * tile_size

    for (let i = start; i < start + 0x10; i++) {
        data.push(gpu.read(startAddr + i))
    }
    return data
}


gpu.draw_background = () => {

    /* Tile Data: 0x8000 - 0x97FF (Contains actual Tile Data)
            Block 0 -> 0x8000 - 0x87FF
            Block 1 -> 0x8800 - 0x8FFF
            Block 2 -> 0x9000 - 0x97FF
    */

    /*  Tile Map: 0x9800 - 0x9FFF (Contains 1-Byte Index to the tile)
        Map 0 -> 0x9800 -> 0x9BFF
        Map 1 -> 0x9C00 -> 0x9FFF
    */


    /*
        Tiles are 8x8 Pixels(64). Every Pixel needs 2 Bits Color Data!
        -> 2 x 64 = 128 Bits -> 16 Bytes
    */
    const size_of_tile = 16

    // View Port -> Specify the top left coords of th 160x144 area within the 256x256 BG Map
    let scx = gpu.read(SCX)
    let scy = gpu.read(SCY)

    // Specify the top-left coords of the Window
    let winY = gpu.read(WINY)
    let winX = gpu.read(WINX) + 7


    let LCDC = gpu.read(0xFF40)

    let tile_map_location = (LCDC & (1 << 3)) ? 0x9C00 : 0x9800
    let tile_data_location = (LCDC & (1 << 4)) ? 0x8000 : 0x8800

    let signed = tile_data_location === 0x8800

    let display_y = gpu.read(LY)
    let y = (display_y + gpu.read(SCY)) % 256
    let row = y / 8
    let buffer_start = display_y * 160
    let palette = gpu.read(BGP)  // Background Palette

    for (let i = 0; i < 160; i++) {
        let x = (i + gpu.read(SCX)) % 256
        let column = x / 8
        let tile_map_index = (row * 32) + column
        let lookup = tile_map_index + tile_map_location
        let tile_pattern = gpu.read_raw(lookup)

        let vram_location = 0

        if (LCDC & (1 << 4)) {
            let adjusted = tile_pattern * 16
            vram_location = tile_data_location + adjusted

        } else {
            vram_location = tile_pattern + tile_data_location
        }

        let tile_id = gpu.address_to_tile_id(vram_location)

        if (gpu.tile_cache[tile_id].dirty) {
            gpu.refresh_tile(tile_id)
        }


        let tile = gpu.tile_cache[tile_id]

        let pixel_x = x % 8
        let pixel_y = y % 8
        let pixel = tile.pixels[(pixel_y * 8) + pixel_x]
        let color = gpu.colorize(pixel, palette)
        let offset = buffer_start + i
        //if(pixel != 0)
        gpu.frame_buffer[offset] = color
    }
}

gpu.draw_sprites = () => {
}
gpu.draw_window = () => {
}

gpu.colorize = (shade, palette) => {
    let colors = [
        //rr    gg    bb
        [0x00, 0x00, 0x00], // Black
        [0x55, 0x55, 0x55], // Grey
        [0xAA, 0xAA, 0xAA], // Light Grey
        [0xFF, 0xFF, 0xFF], // White
    ]

    let real = 0
    switch (shade) {
        case 0:
            real = palette & 3
            break
        case 1:
            real = palette & (3 << 2) >> 2
            break
        case 2:
            real = palette & (3 << 4) >> 4
            break
        case 3:
            real = palette & (3 << 6) >> 6
            break
        default:
            console.error("Invalid Palette Shade!")
    }

    return colors[real]
}

gpu.read = (address) => {
    let data = 0
    if (address >= 0x8000 && address <= 0x9FFF) { // VRAM
        data = gpu.vram[address - 0x8000]
    } else if (address >= 0xFE00 && address <= 0xFE9F) {
        data = gpu.oam[address - 0xFE00]
    }
    return data
}

gpu.write = (data, address) => {
    console.warn(`GPU -> Writing ${data.toString(16)} to ${address.toString(16)}`)

    if (address >= 0x8000 && address <= 0x97FF) {
        if (gpu.mode === 3) return
        gpu.vram[address - 0x8000] = data
    } else if (address >= 0xFF00 && address <= 0xFF7F) {
        mmu.io_reg[address - 0xFF00] = data
    }
}

gpu.refresh_tile = (id) => {
    let offset = 0x8000 + (id * 16)

    let tile = new Array(64)

    for (let y = 0; y < 8; y++) {
        let lowByte = gpu.read_raw(offset + (y * 2))
        let highByte = gpu.read_raw(offset + (y + 2) + 1)
        let x = 7
        while (x >= 0) {
            let flip_x = (x - 7) * -1
            let low_bit = (lowByte >> x) & 1;
            let high_bit = (highByte >> x) & 1;

            let combined = (high_bit << 1) | low_bit;

            tile[((y * 8) + flip_x)] = combined;

            x -= 1;
        }
    }
    gpu.tile_cache[id].dirty = false
    gpu.tile_cache[id].pixels = tile
}

gpu.address_to_tile_id = (address) => {
    return (address - 0x8000) / 16
}

gpu.read_raw = (address) => {
    return gpu.vram[address - 0x8000]
}




