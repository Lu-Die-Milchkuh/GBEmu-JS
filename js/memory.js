"use strict"

let memory = {
    wram: new Array(8192), // 8192 Bytes of Work RAM
    rom: [], // Array to store ROM content in
    vram: new Array(8192), // Video Memory
    hram: new Array(126) // 126 Bytes of High RAM

}

memory.read = (address) => {
    let data = 0

    if (address <= 0x7FFF) {    // ROM
        data = memory.rom[address]
    } else if (address >= 0x8000 && address <= 0x9FFF) {    // VRAM
        data = memory.vram[address & 0x2000]
    } else if (address >= 0xC000 && address <= 0xDFFF) {    // Work RAM
        data = memory.wram[address & 0x2000]
    } else if (address >= 0xE000 && address <= 0xFDFF) {    // Echo RAM
        data = memory.wram[(address - 0x1000) & 0x2000]
    } else if (address >= 0xFF80 && address <= 0xFFFE) {    // High RAM
        data = memory.hram[address % 0x2000]
    } else {
        data = cpu.IE
    }

    return data
}

memory.write = (data, address) => {

    if (address >= 0x014F && address <= 0x7FFF) {   // ROM
        console.log(`Tried to write ${data.toString(16)} into ROM at address ${address.toString(16)}`)
    } else if (address >= 0x8000 && address <= 0x9FFF) {    // VRAM
        memory.vram[address & 0x2000] = data
    } else if (address >= 0xC000 && address <= 0xDFFF) {    // Work RAM
        memory.wram[address & 0x2000] = data
    } else if (address >= 0xFF80 && address <= 0xFFFE) {    // High RAM
        memory.hram[address % 0x2000] = data
    } else {
        cpu.IE = data
    }
}
