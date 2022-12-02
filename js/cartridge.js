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

import {mbc0} from "./mbc/mbc0.js"
import {mbc1} from "./mbc/mbc1.js"

export let cartridge = {
    rom: [],     // Array to Store ROM Content
    //extram: new Array(0x1FFF),   // External RAM
    mbc: 0
}

const mbc_lookup = [
    mbc0,
    mbc1
]

cartridge.read = function (address) {
    return mbc_lookup[this.mbc].read(address)
}

cartridge.write = function (data, address) {
    mbc_lookup[this.mbc].write(data, address)
}


export function read_rom_info() {
    const info = {
        "Title": [],
        "Type": 0,
        "ROM Size": 0,
        "RAM Size": 0,
        "Japanese": 0,
    }

    const ram_size_lookup = [0, 2048, 8192, 32768]

    for (let i = 0x134; i < 0x143; i++) {
        let data = cartridge.rom[i]
        info.Title.push(data)
    }

    info.Title = String.fromCharCode.apply(null, info.Title)

    info.Type = cartridge.rom[0x147]
    cartridge.mbc = info.Type
    info["ROM Size"] = 32768 << cartridge.rom[0x148]
    info["RAM Size"] = ram_size_lookup[cartridge.rom[0x149]]
    info.Japanese = !!cartridge.rom[0x14A]


    let table = document.createElement("table")
    let caption = document.createElement("caption")
    caption.innerHTML = "ROM Information"

    let tb = table.createTBody()

    for(const el in info) {
        let tr = tb.insertRow()
        let th = document.createElement("th")
        let td = document.createElement("td")

        th.innerHTML = el
        td.innerHTML = info[el]

        tr.append(th)
        tr.append(td)
        tb.append(tr)
    }

    table.append(caption)
    table.append(tb)
    document.querySelector("#info-block").append(table)

}