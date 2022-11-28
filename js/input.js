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
import {gamepad_state} from "./controller.js"
import {keyboard_state} from "./keyboard.js"
import {cpu} from "./cpu.js"

/*
Taken from pandocs
    Bit 7 - Not used
    Bit 6 - Not used
    Bit 5 - P15 Select Button Keys (0=Select)
    Bit 4 - P14 Select Direction Keys (0=Select)
    Bit 3 - P13 Input Down or Start (0=Pressed) (Read Only)
    Bit 2 - P12 Input Up or Select (0=Pressed) (Read Only)
    Bit 1 - P11 Input Left or Button B (0=Pressed) (Read Only)
    Bit 0 - P10 Input Right or Button A (0=Pressed) (Read Only)
*/
let state = 0xCF

export function updateControls() {
    state = keyboard_state | gamepad_state
    mmu.write(state,0xFF00)
    if(state !== 0) {
        cpu.isStop = false // Pressing a Button wakes Game Boy up
    }
    //console.log(`Updating Controls ${state.toString(2)}`)
}