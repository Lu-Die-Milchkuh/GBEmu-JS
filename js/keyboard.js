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

/*
    Game Boy         PC Keyboard

    Up                  w
    Down                s
    Left                a
    Right               d
    A                   e
    B                   r
    Start               f
    Select              q
*/

const valid_keys = ["w","a","s","d","e","r","q","f"]

const keyboard_Joypad = {
    "w": 2,   // Up
    "s": 3,   // Down
    "a": 1,    // Left
    "d": 0,   // Right
    "e": 0,      // A
    "r": 1,   // B
    "f": 3,   // Start
    "q": 2,   // Select
}

export let keyboard_state = 0xCF

export function keyboard_update(event) {
    if(valid_keys.includes(event.key)) {
        console.log(event.key)
        let old_input = mmu.read(0xFF00)
        //console.log(new_input.toString(2))
        keyboard_state = old_input & ~(1 << keyboard_Joypad[event.key])
    }
}