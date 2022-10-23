"use strict"

let memory = {
    wram: new Array(8192), // 8192 Bytes of Work RAM
    rom: [], // Array to store ROM content in
    vram: new Array(8192), // Video Memory
    hram: new Array(126) // 126 Bytes of High RAM

}

memory.read = (address) => {
    let data = 0

    if(address <= 0x7FFF) {
        data = memory.rom[address]
    }
    else if(address >= 0x8000 && address <= 0x9FFF) {
        data = memory.vram[address & 0x2000]
    }
    else if(address >= 0xC000 && address <= 0xDFFF) {
        data = memory.wram[address & 0x2000]
    }
    else {
        data = cpu.IE
    }

    return data
}

memory.write = (data,address) => {

    if(address >= 0x014F && address <= 0x7FFF) {
        console.log(`Tried to write ${data.toString(16)} into ROM at address ${address.toString(16)}`)
    }
    else if(address >= 0x8000 && address <= 0x9FFF) {
        memory.vram[address & 0x2000] = data
    }
    else if(address >= 0xC000 && address <= 0xDFFF) {
        memory.wram[address & 0x2000] = data
    }
    else {
        cpu.IE = data
    }
}
