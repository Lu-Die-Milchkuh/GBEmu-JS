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
import {gpu} from "./gpu.js"

export let oam = {
    active: false,
    source: 0,
    destination: 0,
    cycles: 20
}

oam.request = function(src) {
    this.active = true
    this.source = src  / 0x100    // Check this
    this.destination = 0xFE00

}

oam.update = function(cycles) {

    if(this.active) {
        let from = this.source
        let to = this.destination
        let adjusted_cycles = cycles

        if((this.cycles - adjusted_cycles) < 0) {
            adjusted_cycles = this.cycles
        }

        let bytes = (adjusted_cycles * 8) % 256

        this.source = (this.source + bytes) & 0xFFFF
        this.destination = (this.source + bytes) & 0xFFFF
        this.cycles -= adjusted_cycles

        if(this.cycles <= 0) {
            this.active = false
            this.cycles = 20
        }

        console.log(`OAM write Bytes: ${bytes}`)
        for(let offset = 0; offset < bytes; offset++) {
            let value = mmu.read((from + offset) & 0xFFFF)
            //console.log(`OAM Val ${value} from ${(from+offset).toString(16)}`)
            mmu.write(value,(to + offset) & 0xFFFF)
            //gpu.write(value,(to + offset) & 0xFFFF) // TODO Check this
        }
   }
}