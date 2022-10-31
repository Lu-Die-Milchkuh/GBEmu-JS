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
    frame_buffer: new Array(160 * 144),
    bg_buffer: new Array(256 * 256),

    // Address Macros
    STAT: 0xFF41,
    // Viewport Addresses
    scx: 0xFF43,    // X Pos of BG
    scy: 0xFF42,    // Y Pos of BG
    winX: 0xFF4B,   // X Pos of Viewing Area, BG + 7 !
    winY: 0xFF4A,   // Y Pos of Viewing Area

    LY: 0xFF44,
    LYC: 0xFF45

}

const OAM_PERIOD = 80
const TRANSFER_PERIOD = OAM_PERIOD + 172
const HBLANK_PERIOD = 456
const FRAME_PERIOD = screen.height * HBLANK_PERIOD
const VBLANK_PERIOD = FRAME_PERIOD + 4560


gpu.reset = () => {
    gpu.clock.frame_cycles = 0
    gpu.clock.scanline_cycles = 0

}

gpu.update = (cycles) => {
    let LCDC = mmu.read(0xFF40)
    if (!(LCDC & (1 << 7))) return

    let request = 0
    gpu.clock.frame_cycles += cycles
    gpu.clock.scanline_cycles += cycles
    let old_mode = gpu.mode


    if (gpu.clock.frame_cycles > FRAME_PERIOD) {
        if (old_mode !== 1) {
            gpu.setMode(1)    // We are in VBLANK
            cpu.requestInterrupt(0)
            request = mmu.read(gpu.STAT) & (1 << 4)
        }

        if (gpu.clock.frame_cycles > VBLANK_PERIOD) {
            gpu.clock.scanline_cycles = 0
            gpu.clock.frame_cycles = 0
            mmu.write(0x0, gpu.LY)   // Clear LY
            gpu.setMode(2)
        }
    } else {

        if (gpu.clock.scanline_cycles >= 0 && gpu.clock.scanline_cycles <= OAM_PERIOD) {
            if (old_mode !== 2) {
                gpu.setMode(2)
                request = mmu.read(gpu.STAT) & (1 << 5)
            }

        } else if (gpu.clock.scanline_cycles > OAM_PERIOD && gpu.clock.scanline_cycles <= TRANSFER_PERIOD) {
            if (old_mode !== 3) {
                gpu.setMode(3)
                gpu.update_scanline()
            }

        } else if (gpu.clock.scanline_cycles > TRANSFER_PERIOD && gpu.clock.scanline_cycles <= HBLANK_PERIOD) {
            if (old_mode !== 0) {
                gpu.setMode(0)
                request = mmu.read(gpu.STAT) & (1 << 3)
            }
        }
    }

    if (request) {
        cpu.requestInterrupt(1)
    }

    if (gpu.clock.scanline_cycles > HBLANK_PERIOD) {
        let temp = mmu.read(gpu.LY)
        temp++
        mmu.write(temp, gpu.LY)
        gpu.clock.scanline_cycles += 8
        gpu.line_compare()
    }
}

gpu.line_compare = () => {

    let temp_stat = mmu.read(gpu.STAT)
    if (mmu.read(gpu.LY) === mmu.read(gpu.LYC)) {
        temp_stat |= (1 << 2)
        cpu.requestInterrupt(1)
    } else {
        temp_stat = temp_stat & 0xFB
    }
    mmu.write(temp_stat, gpu.STAT)
}

gpu.setMode = (mode) => {
    gpu.mode = mode
    let newSTAT = mmu.read(gpu.STAT)
    newSTAT &= 0xFC
    newSTAT |= mode
    mmu.write(newSTAT, gpu.STAT)

}

gpu.update_scanline = () => {
    let LCDC = mmu.read(0xFF40)

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

gpu.updateLY = () => {
    mmu.write(gpu.line, gpu.LY)
    let stat = mmu.read(gpu.STAT)

    // Bit 2 of STAT is set when LY contains the same value as LYC
    if (mmu.read(gpu.LY) === mmu.read(gpu.LYC)) {
        stat |= (1 << 2)
        mmu.write(stat, gpu.STAT)
        if (stat & (1 << 6)) {
            cpu.requestInterrupt(1)
        }
    } else {
        stat = stat & (0xFF - (1 << 2))
        mmu.write(stat, gpu.STAT)
    }

}

gpu.read_tile_data = (index, startAddr) => {
    let tile_size = 0x10 // 16 Bytes
    //let line = mmu.read(gpu.LY)
    let data = []

    let start = index * tile_size

    for (let i = start; i < start + 0x10; i++) {
        data.push(mmu.read(startAddr + i))
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
    let scx = mmu.read(gpu.scx)
    let scy = mmu.read(gpu.scy)

    // Specify the top-left coords of the Window
    let winY = mmu.read(gpu.winY)
    let winX = mmu.read(gpu.winX) + 7


    let LCDC = mmu.read(0xFF40)

    let tile_map_location = (LCDC & (1 << 3)) ? 0x9C00 : 0x9800
    let tile_data_location = (LCDC & (1 << 4)) ? 0x8000 : 0x8800

    let signed = tile_data_location === 0x8800


    for (let i = 0; i < screen.width; i++) {
        let index = mmu.read(tile_map_location + i)
        if (signed) {

            index = (index & 0x80 ? (index - 256) : index) + 128
        }

        let tile = gpu.read_tile_data(index, tile_map_location)
    }
}

gpu.draw_sprites = () => {
}
gpu.draw_window = () => {
}


