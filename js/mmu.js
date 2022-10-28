"use strict"

let mmu = {
    wram: new Array(8192), // 8192 Bytes of Work RAM
    rom: [], // Array to store ROM content in
    vram: new Array(8192), // Video Memory
    hram: new Array(126), // 126 Bytes of High RAM
    extram: new Array(0x1FFF)
}

mmu.reset = () => {
    mmu.wram.fill(0)
    mmu.vram.fill(0)
    mmu.hram.fill(0)
    mmu.extram.fill(0)
}

mmu.read = (address) => {
    let data = 0

    if (address <= 0x7FFF) {    // ROM
        data = mmu.rom[address]
    } else if (address >= 0x8000 && address <= 0x9FFF) {    // VRAM
        data = mmu.vram[address & 0x2000]
    } else if(address >= 0xA000 && address <= 0xBFFF) {     // External RAM
        data = mmu.extram[address % 0x1FFF]
    }
    else if (address >= 0xC000 && address <= 0xDFFF) {    // Work RAM
        data = mmu.wram[address & 0x2000]
    } else if (address >= 0xE000 && address <= 0xFDFF) {    // Echo RAM
        data = mmu.wram[(address - 0x2000) & 0x2000]
    } else if (address >= 0xFF80 && address <= 0xFFFE) {    // High RAM
        data = mmu.hram[address % 0x2000]
    } else {
        data = cpu.IE
    }

    return data
}

mmu.write = (data, address) => {
    console.warn(`Writing ${data.toString(16)} to ${address.toString(16)}`)
    if (address >= 0x014F && address <= 0x7FFF) {   // ROM
        console.warn(`Tried to write ${data.toString(16)} into ROM at address ${address.toString(16)}`)
    } else if (address >= 0x8000 && address <= 0x9FFF) {    // VRAM
        mmu.vram[address & 0x2000] = data
    } else if (address >= 0xC000 && address <= 0xDFFF) {    // Work RAM
        mmu.wram[address & 0x2000] = data
    } else if (address >= 0xFF80 && address <= 0xFFFE) {    // High RAM
        mmu.hram[address % 0x2000] = data
    } else {
        cpu.IE = data
    }
}