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

import {cartridge} from "../cartridge.js"

export let mbc1 = {
    rom_bank: 1,
    ram_bank: 0,
    ram_enabled: false,
    extram: new Array(0x8000).fill(0),
    mode: 0 // 0 -> Rom, 1 -> RAM

}

mbc1.adjust_rom_bank = function () {
    if(this.rom_bank === 0 || this.rom_bank === 0x20
        || this.rom_bank === 0x40 || this.rom_bank === 0x60)
    {
        this.rom_bank++
    }
}


mbc1.read = function(address) {
    let data = 0

    if(address >= 0 && address <= 0x3FFF) { // Rom Bank 0
        data = cartridge.rom[address]

    } else if(address >= 0x4000 && address <= 0x7FFF){  // Rom Bank 1
        let index = address - 0x4000
        let offset = (0x4000 * this.rom_bank) + index
        data = cartridge.rom[offset & 0xFFFF]
    }
    else if(address >= 0xA000 && address <= 0xBFFF) {   // External RAm
        if(!this.ram_enabled)  {
            data = 0xFF
        }
        else {
            let index = address - 0xA000
            let offset = (0x2000 * this.ram_bank) + index
            data = this.extram[offset & 0xFFFF]
        }
    }

    return data
}

mbc1.write = function (data,address) {

    if(address >= 0 && address <= 0x1FFF) {     // Writing to Rom Bank 0 enables external RAM
        let bits = data & 0xF
        this.ram_enabled = (bits === 0x0A)

    } else if(address >= 0x2000 && address <= 0x3FFF) {

        let bank_number = data & 0x1F
        this.rom_bank = (this.rom_bank & 0xE0) | bank_number
        this.adjust_rom_bank()

    } else if(address >= 0x4000 && address <= 0x5FFF) {
        let bank_id = data & 3

        switch (this.mode) {
            case 0:
                this.rom_bank |= (bank_id << 5)
                this.adjust_rom_bank()
                break
            case 1:
                this.ram_bank = bank_id
        }
    }
    else if(address >= 0x6000  && address <= 0x7FFF) {
        this.mode = (data & 1) ? 1 : 0

    } else if(address >= 0xA000 && address <= 0xBFFF) {
        if(!this.ram_enabled) return

        let index = address - 0xA000
        let offset = (0x2000 * this.ram_bank) + index
        this.extram[offset & 0xFFFF] = data

    } else {
        console.error(`MBC1 Write ${data.toString(16)} to invalid address : ${address.toString(16)}`)
    }
}