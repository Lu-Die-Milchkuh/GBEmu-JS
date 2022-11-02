"use strict"

import {gpu} from "./gpu.js"
import {cpu} from "./cpu.js"

export let mmu = {
    wram: new Array(0x2000), // 8192 Bytes of Work RAM
    rom: [], // Array to store ROM content in
    hram: new Array(0x7E), // 126 Bytes of High RAM
    extram: new Array(0x1FFF),
    io_reg: new Array(0x7F)
}

mmu.reset = function() {
    this.wram.fill(0x0)
    this.hram.fill(0x0)
    this.extram.fill(0x0)
    this.io_reg.fill(0x0)


}

mmu.read = function(address) {
    let data = 0x0

    if (address <= 0x7FFF) {    // ROM
        data = this.rom[address]
    } else if (address >= 0x8000 && address <= 0x9FFF) {    // VRAM
        if(!gpu.vblank) {
            data = this.vram[address - 0x8000]
        } else {
            console.warn(`Tried to read from VRAM at ${address.toString(16)} during VBLANK!`)
            data = 0xFF
        }

    } else if (address >= 0xA000 && address <= 0xBFFF) {     // External RAM
        data = this.extram[address - 0xA000]
    } else if (address >= 0xC000 && address <= 0xDFFF) {    // Work RAM
        data = this.wram[address - 0xC000]
    } else if (address >= 0xE000 && address <= 0xFDFF) {    // Echo RAM
        data = this.wram[(address - 0x2000) & 0x2000]
    } else if (address >= 0xFF00 && address <= 0xFF7F) {     // IO Register
        data = this.io_reg[address - 0xFF00]
    } else if (address >= 0xFF80 && address <= 0xFFFE) {    // High RAM
        data = this.hram[address - 0xFF80]
    } else {
        data = cpu.IE
    }

    return data
}

mmu.write = function(data, address) {
    console.warn(`CPU -> Writing ${data.toString(16)} to ${address.toString(16)}`)
    if (address >= 0x014F && address <= 0x7FFF) {   // ROM
        console.warn(`Tried to write ${data.toString(16)} into ROM at address ${address.toString(16)}`)
    } else if (address >= 0x8000 && address <= 0x9FFF) {    // VRAM
        if(!gpu.vblank) {
            gpu.vram[address - 0x8000] = data
        } else {
            console.warn(`Tried to write ${data.toString(16)} to VRAM at ${address.toString(16)} during VBLANK!`)
        }

    } else if (address >= 0xC000 && address <= 0xDFFF) {    // Work RAM
        this.wram[address - 0xC000] = data
    } else if (address >= 0xFF00 && address <= 0xFF7F) {     // IO Register
        this.io_reg[address - 0xFF00] = data
    } else if (address >= 0xFF80 && address <= 0xFFFE) {    // High RAM
        this.hram[address - 0xFF80] = data
    } else {
        cpu.IE = data
    }
}
