"use strict"

let memory = {
    workram: [], // 8192 Bytes of Work RAM
    rom: [] // Array to store ROM content in
}

memory.read = (address) => {
    let data = 0

    if(address <= 0x7FFF) {
        data = memory.rom[address]
    }
    else if(address >= 0xC000 && address <= 0xDFFF) {
        data = memory.workram[address & 0x2000]
    }

    return data
}

memory.write = (data,address) => {
    if(address >= 0xC000 && address <= 0xDFFF) {
        memory.workram[address & 0x2000] = data
    }
}