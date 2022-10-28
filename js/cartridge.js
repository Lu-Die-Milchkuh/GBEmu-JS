"use strict"

import {mmu} from "./mmu.js";

export function read_rom_info() {
    const info = {
        "title": [],
        "type": 0,
        "rom size": 0,
        "ram size": 0,
    }

    const ram_size_lookup = [0, 2048, 8192, 32768]

    for (let i = 0x134; i < 0x143; i++) {
        let data = mmu.read(i)
        info.title.push(data)
    }

    info.title = String.fromCharCode.apply(null, info.title)
    info.type = mmu.read(0x147)
    info["rom size"] = 32768 << mmu.read(0x148)
    info["ram size"] = ram_size_lookup[mmu.read(0x149)]

    console.table(info)
}