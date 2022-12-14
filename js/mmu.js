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

import { gpu } from "./gpu.js"
import { cpu } from "./cpu.js"
import { oam } from "./dma.js"
import { cartridge } from "./cartridge.js"

export let mmu = {
    wram: new Array(0x2000), // 8192 Bytes of Work RAM
    hram: new Array(127), // 126 Bytes of High RAM
    io_reg: new Array(0x80)
}

mmu.reset = function () {
    this.wram.fill(0x0)
    this.hram.fill(0x0)
    this.io_reg.fill(0x0)

}

mmu.read = function (address) {
    let data = 0x0

    if (address <= 0x7FFF) {    // ROM
        data = cartridge.read(address)
    } else if (address >= 0x8000 && address <= 0x9FFF) {    // VRAM
        //if(!gpu.vblank) {
        data = gpu.read(address)//gpu.vram[address - 0x8000]
        //} else {
        //    console.warn(`Tried to read from VRAM at ${address.toString(16)} during VBLANK!`)
        //    data = 0xFF
        //}

    } else if (address >= 0xA000 && address <= 0xBFFF) {     // External RAM
        data = cartridge.read(address)
    } else if (address >= 0xC000 && address <= 0xDFFF) {    // Work RAM
        data = this.wram[address - 0xC000]
    } else if (address >= 0xE000 && address <= 0xFDFF) {    // Echo RAM
        data = this.wram[address - 0xE000]
    } else if (address >= 0xFE00 && address <= 0xFE9F) {
        data = gpu.read(address)
    } else if (address >= 0xFEA0 && address <= 0xFEFF) {
        // unused memory region
        //console.error(`Tried to read from unused memory region (${address.toString(16)})`)
        data = 0xFF
    } else if (address >= 0xFF00 && address <= 0xFF7F) {     // IO Register
        data = this.io_reg[address - 0xFF00]
    } else if (address >= 0xFF80 && address <= 0xFFFE) {    // High RAM
        data = this.hram[address - 0xFF80]
    } else if (address === 0xFFFF) {
        data = cpu.IE
    } else {
        console.error(`Invalid Address (mmu.read) ${address.toString(16)}`)
    }

    return data
}

mmu.write = function (data, address) {
    //console.warn(`CPU -> Writing ${data.toString(16)} to ${address.toString(16)}`)
    if (address >= 0 && address <= 0x7FFF) {   // ROM 0x014F
        //console.warn(`Tried to write ${data.toString(16)} into ROM at address ${address.toString(16)}`)
        //mmu.rom[address] = data
        cartridge.write(data, address)
    } else if (address >= 0x8000 && address <= 0x9FFF) {    // VRAM

        gpu.write(data, address)

    } else if (address >= 0xA000 && address <= 0xBFFF) {     // External RAM

        cartridge.write(data, address)

    } else if (address >= 0xC000 && address <= 0xDFFF) {    // Work RAM
        this.wram[address - 0xC000] = data

    } else if (address >= 0xE000 && address <= 0xFDFF) { // Echo RAM
        this.wram[address - 0xE000] = data
    } else if (address >= 0xFE00 && address <= 0xFE9F) {   // OAM
        gpu.write(data, address)

    } else if (address >= 0xFEA0 && address <= 0xFEFF) {
        // unused memory region
        // Writing to this memory region does nothing. Some games do it,it is not considered as an "error,failure"
        //console.error(`Tried to write ${data.toString(16)} to unused memory region (${address.toString(16)})`)

    } else if (address >= 0xFF00 && address <= 0xFF7F) {     // IO Register

        if (address !== 0xFF04) {
            if (address === 0xFF46) {
                //console.log(`Requested OAM transfer: ${data.toString()}`)
                oam.request(data)
            } else {
                this.io_reg[address - 0xFF00] = data
            }
        } else {    // If the CPU writes to DIV, it will be reset
            this.io_reg[0xFF04 - 0xFF00] = 0
        }

    } else if (address >= 0xFF80 && address <= 0xFFFE) {    // High RAM
        this.hram[address - 0xFF80] = data
    } else if (address === 0xFFFF) {
        cpu.IE = data
    } else {
        console.error(`Invalid Address (mmu.write) ${address.toString(16)}, data = ${data.toString(16)}`)
    }
}
