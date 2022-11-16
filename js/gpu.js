/*
    WebBoy - A GameBoy Emulator written in Javascript
    Copyright (C) 2022  Lucas Zebrowsky aka Lu-Die-Milchkuh

    Find me on Github: https://github.com/Lu-Die-Milchkuh

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

"use strict"

import {mmu} from "./mmu.js"
import {cpu} from "./cpu.js"
import {screen} from "./screen.js"


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


// TileEntry (for Tile Cache)
class TileEntry {
    dirty = true
    pixels = new Array(64)
}

class SpriteEntry {
    y_pos = 0
    x_pos = 0
    tile_id = 0
    behind_background = false
    x_flip = false
    y_flip = false
    use_palette_one = false

}

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
    sprite_table: [],
    frame_buffer: [], //new Array(160 * 144),
    drawFlag: false
    //bg_buffer: new Array(256 * 256),
}


gpu.reset = function () {
    this.clock.frame_cycles = 0
    this.clock.scanline_cycles = 0
    this.vram.fill(0x0)
    this.oam.fill(0x0)

    for (let i = 0; i < 384; i++) {
        let tile = new TileEntry()
        this.tile_cache.push(tile)
    }

    for(let i = 0; i < 40; i++) {
        let sprite = new SpriteEntry()
        this.sprite_table.push(sprite)
    }

    for (let i = 0; i < 160 * 144; i++) {
        this.frame_buffer[i] = [255, 255, 255]
    }
}

gpu.update = function (cycles) {

    let LCDC = mmu.io_reg[0xFF40 - 0xFF00] //gpu.read(0xFF40)
    //console.log(`LCDC Bit 7: ${(LCDC & (1 << 7)).toString(16)} ${LCDC}`)
    if (!(LCDC & (1 << 7))) return

    //console.warn("LCDC Enabled: Updating GPU")

    let request = false
    this.clock.frame_cycles += cycles
    this.clock.scanline_cycles += cycles
    let old_mode = this.mode
    this.vblank = false

    if (this.clock.frame_cycles > FRAME_PERIOD) {
        this.vblank = true
        if (old_mode !== 1) {
            this.setMode(1)    // We are in VBLANK
            cpu.requestInterrupt(0)
            request = (this.read(STAT) & (1 << 4))
        }

        if (this.clock.frame_cycles > VBLANK_PERIOD) {
            this.clock.scanline_cycles = 0
            this.clock.frame_cycles = 0
            this.write(0x0, LY)   // Clear LY
            this.setMode(2)  // Searching OAM
        }
    } else {

        if (this.clock.scanline_cycles >= 0 && this.clock.scanline_cycles <= OAM_PERIOD) {
            if (old_mode !== 2) {
                this.setMode(2)  // Searching OAM
                request = (this.read(STAT) & (1 << 5))
            }

        } else if (this.clock.scanline_cycles >= OAM_PERIOD && this.clock.scanline_cycles <= TRANSFER_PERIOD) {
            if (old_mode !== 3) {
                this.setMode(3)  // Transfer Data to LCD
                console.log("Update Scanline")
                this.update_scanline()
            }

        } else if (this.clock.scanline_cycles >= TRANSFER_PERIOD && this.clock.scanline_cycles <= HBLANK_PERIOD) {
            if (old_mode !== 0) {
                this.setMode(0)  // HBLANK
                request = this.read(STAT) & (1 << 3)
            }
        }
    }

    if (request) {
        cpu.requestInterrupt(1)
    }

    if (this.clock.scanline_cycles > HBLANK_PERIOD) {
        let newLY = this.read(LY)
        newLY = (newLY + 1) % 256
        this.write(newLY, LY)
        this.clock.scanline_cycles = 0
        this.line_compare()
    }
}

gpu.line_compare = function () {

    let temp_stat = this.read(STAT)

    if (this.read(LY) === this.read(LYC)) {
        temp_stat |= (1 << 2)
        cpu.requestInterrupt(1)
    } else {
        temp_stat = temp_stat & 0b11111011
    }
    this.write(temp_stat, STAT)
}

gpu.setMode = function (mode) {
    this.mode = mode
    let newSTAT = this.read(STAT)
    newSTAT &= 0xFC
    newSTAT |= mode
    this.write(newSTAT, STAT)

}

gpu.update_scanline = function () {
    let LCDC = this.read(0xFF40)

    let bg_priority = new Array(160)

    if (LCDC & 0x1) {    // 0b0000 0001
        console.log("Draw -> Background")
        this.draw_background()
        this.drawFlag = true
    }

    if (LCDC & 0x2) {    // 0b0000 0010
        console.log("Draw -> Sprites")
        this.draw_sprites()
        this.drawFlag = true
    }

    if (LCDC & 0x20) {   // 0b0010 0000
        console.log("Draw -> Window")
        this.draw_window(bg_priority)
        this.drawFlag = true
    }

    if (this.drawFlag) {
        screen.update()
        this.drawFlag = false
    }

}


gpu.draw_background = function () {

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
    //const size_of_tile = 16

    // View Port -> Specify the top left coords of th 160x144 area within the 256x256 BG Map
    //let scx = gpu.read(SCX)
    //let scy = gpu.read(SCY)

    // Specify the top-left coords of the Window
    //let winY = gpu.read(WINY)
    //let winX = gpu.read(WINX) + 7


    let LCDC = this.read(0xFF40)

    let tile_map_location = (LCDC & (1 << 3)) ? 0x9C00 : 0x9800
    let tile_data_location = (LCDC & (1 << 4)) ? 0x8000 : 0x8800

    //let signed = tile_data_location === 0x8800

    let display_y = this.read(LY)
    let y = (display_y + this.read(SCY)) % 256
    let row = y / 8
    let buffer_start = display_y * 160
    let palette = this.read(BGP)  // Background Palette

    for (let i = 0; i < 160; i++) {
        let x = (i + this.read(SCX)) % 256
        let column = x / 8
        let tile_map_index = (row * 32) + column
        let lookup = tile_map_index + tile_map_location
        let tile_pattern = this.read_raw(lookup)

        let vram_location = 0

        if (LCDC & (1 << 4)) {
            let adjusted = tile_pattern * 16
            vram_location = tile_data_location + adjusted

        } else {
            vram_location = tile_pattern + tile_data_location
        }

        let tile_id = this.address_to_tile_id(vram_location)

        if (this.tile_cache[tile_id].dirty) {
            this.refresh_tile(tile_id)
        }


        let tile = this.tile_cache[tile_id]

        let pixel_x = x % 8
        let pixel_y = y % 8
        let pixel = tile.pixels[(pixel_y * 8) + pixel_x]
        let color = this.colorize(pixel, palette)
        let offset = buffer_start + i
        //if(pixel != 0)
        this.frame_buffer[offset] = color
    }
}

gpu.draw_window = function (bg_priority) {
    let window_y = mmu.read(WINY)
    let window_x = (mmu.read(WINX) + 7) % 256
    let y = mmu.read(LY)
    let palette = mmu.read(BGP)
    let LCDC = mmu.read(0xFF40)

    if (y < window_y) return


    let tile_map_location = (LCDC & (1 << 6)) ? 0x9C00 : 0x9800
    let tile_data_location = (LCDC & (1 << 4)) ? 0x8000 : 0x9000

    let pixel_y = y % 8
    let buffer_start = y * screen.width

    let row = (y - window_y) / 8

    for(let i = 0; i < 160; i++) {
        let display_x = (i + window_x ) % 256
        let column  = (i / 8) >>> 0
        let tile_map_index = (row * 32) + column
        let offset = tile_map_location + tile_map_index
        let tile_pattern = this.read_raw(offset)

        let vram_location

        if(LCDC & (1<<4)) {
            vram_location = (tile_pattern * 16) + tile_data_location
        } else {
            let adjusted = ((tile_pattern)) * 16
            vram_location = (tile_data_location) + adjusted
        }

        let tile_id = this.address_to_tile_id(vram_location)

        if(this.tile_cache[tile_id].dirty) {
            this.refresh_tile(tile_id)
        }

        let pixel_x = i % 8
        let tile = this.tile_cache[tile_id]
        let pixel = tile.pixels[(pixel_y * 8) + pixel_x]
        let color = this.colorize(pixel,palette)
        let buffer_offset = buffer_start + i
        if(pixel !== 0) {
            bg_priority[i] = true
        }

        this.frame_buffer[buffer_offset] = color
    }
}

gpu.draw_sprites = function () {
    let scanline_y = mmu.read(LY)
    let LCDC = mmu.read(0xFF40)


    let tall_sprite_mode = LCDC & (1 << 2)
    let sprite_y_max = 0

    if(tall_sprite_mode) {
        sprite_y_max = 15
    } else {
        sprite_y_max = 7
    }

    for(let i = 0; i < this.sprite_table.length;i++) {

        let sprite = this.sprite_table[i]
        if(scanline_y >= sprite.y_pos && scanline_y <= sprite.y_pos + sprite_y_max
            && sprite.x_pos + 8 >= 0 && sprite.x_pos < 16)
        {
            let sprite_x = sprite.x_pos
            let sprite_y = sprite.y_pos

            let pixel_y = ((scanline_y - 1) >>> 0) % 8
            let lookup_y = sprite.x_flip ? (pixel_y - 7) * -1 : pixel_y

            let tile_id = 0

            if(tall_sprite_mode) {
                if((scanline_y - sprite_y) < 8) {
                    if(sprite.y_flip) {
                        tile_id = sprite.tile_id || 1
                    } else {
                        tile_id = sprite.tile_id & 0xFE
                    }
                } else {
                    if(sprite.y_flip) {
                        tile_id = sprite.tile_id & 0xFE
                    } else {
                        tile_id = sprite.tile_id || 1
                    }
                }
            } else {
                tile_id = sprite.tile_id
            }

            if(this.tile_cache[tile_id].dirty) {
                this.refresh_tile(tile_id)
            }

            let tile = this.tile_cache[tile_id]

            // TODO -> Palette
            let palette = sprite.use_palette_one ? mmu.io_reg[0xFF49 - 0xFF00] : mmu.io_reg[0xFF48 - 0xFF00]


            for(let pixel_x = 0; i < 8;pixel_x++) {
                let adjust_x = (sprite_x + pixel_x) % 256

                let lookup_x = sprite.x_flip ? (pixel_x -7) * -1 : pixel_x

                let pixel = tile.pixels[(lookup_y * 8) + lookup_x]

                if(pixel === 0) continue

                // TODO Fix this
                /*if(sprite.behind_background) {
                    if()
                }*/

                let color = this.colorize(pixel,palette)
                let offset_x = adjust_x
                let offset_y = scanline_y * 160
                let offset = offset_x + offset_y
                this.frame_buffer[offset] = color

            }

        }
    }


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
            real = (palette & (3 << 2)) >> 2
            break
        case 2:
            real = (palette & (3 << 4)) >> 4
            break
        case 3:
            real = (palette & (3 << 6)) >> 6
            break
        default:
            console.error("Invalid Palette Shade!")
    }

    return colors[real]
}

gpu.read = function (address) {
    let data = 0
    if (address >= 0x8000 && address <= 0x9FFF) { // VRAM
        if(this.mode === 3) {
            data = 0xFF
        } else {
            data = this.vram[address - 0x8000]
        }

    } else if (address >= 0xFE00 && address <= 0xFE9F) {
        data = this.oam[address - 0xFE00]
    }
    return data
}

gpu.write = function (data, address) {
    //console.warn(`GPU -> Writing ${data.toString(16)} to ${address.toString(16)}`)

    if (address >= 0x8000 && address <= 0x97FF) {
        if (this.mode === 3) return

        let index = address - 0x8000
        this.vram[index] = data
        if(address <= 0x97FF) {
            let tile_id = (index / 16) >>> 0
            //console.log(tile_id)
            this.tile_cache[tile_id].dirty = true
        }

    }
    else if(address >= 0xFE00 && address <= 0xFE9F) {
        if(this.mode === 2 || this.mode === 3 ) {
            return
        }
        this.oam[address - 0xFE00] = data
        this.update_sprite(data,address)
    }
    else if (address >= 0xFF00 && address <= 0xFF7F) {
        mmu.io_reg[address - 0xFF00] = data
    }
}

gpu.update_sprite = function(data,address) {
    let sprite_id = ((address - 0xFE00) / 4) >>> 0
    let sprite = this.sprite_table[sprite_id]
    let data_type = address % 4

    switch (data_type) {
        case 0:
            sprite.y_pos = data - 16
            break
        case 1:
            sprite.x_pos = data - 8
            break
        case 2:
            sprite.tile_id = data
            break
        case 3:
            sprite.background = (data & (1 << 7))  > 0
            sprite.y_flip = (data & (1<<6)) > 0
            sprite.x_flip = (data & (1<<5)) > 0
            sprite.use_palette_one = (data & (1<<4)) > 0
            break
        default:
            console.error(`Error in gpu.update_sprite -> data_type ${data_type}`)
    }
}

gpu.refresh_tile = function (id) {
    let offset = 0x8000 + (id * 16)

    let tile = new Array(64)

    for (let y = 0; y < 8; y++) {
        let lowByte = this.read_raw(offset + (y * 2))
        let highByte = this.read_raw(offset + (y + 2) + 1)
        let x = 7
        while (x >= 0) {
            let flip_x = (x - 7) * -1
            let low_bit = (lowByte >> x) & 1
            let high_bit = (highByte >> x) & 1

            tile[((y * 8) + flip_x)] = (high_bit << 1) | low_bit

            x -= 1
        }
    }
    this.tile_cache[id].dirty = false
    this.tile_cache[id].pixels = tile
}

gpu.address_to_tile_id = function (address) {
    return (address - 0x8000) / 16
}

gpu.read_raw = function (address) {
    return this.vram[address - 0x8000]
}




