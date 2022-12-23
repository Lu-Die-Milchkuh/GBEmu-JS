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

import {mmu} from "./mmu.js";
import {cpu} from "./cpu.js";

export let gamepad_state = 0xCF

/*
    Standard Gamepad Mapping:


                    Xbox         PS          Nintendo
    button[0]  ->    A          Cross           B
    button[1]  ->    B          Circle          A
    button[2]  ->    X          Square          Y
    button[3]  ->    Y          Triangle        X
    button[12] ->    Up         Up              Up
    button[13] ->    Down       Down            Down
    button[14] ->    Left       Left            Left
    button[15] ->    Right      Right           Right
    button[9]  ->    Start      Start           Select
    button[8]  ->    Select     Start           Select


    Emulator Mapping:

    A        ->     button[0]
    B        ->     button[1]
    UP       ->     button[12]
    DOWN     ->     button[13]
    LEFT     ->     button[14]
    RIGHT    ->     button[15]
    START    ->     button[9]
    SELECT   ->     button[8]
*/

export function gamepad_update() {
    if(navigator.getGamepads()) {
        const gamepad = navigator.getGamepads()[0]
        let old_input = mmu.read(0xFF00)

        // A Button or Right
        if(gamepad.buttons[0].pressed || gamepad.buttons[15].pressed) {
            //console.log(`Button A or Right`)
            old_input = old_input & ~(1 << 0)
        } else {
            old_input = old_input & (1 << 0)
        }

        // B Button or Left
        if(gamepad.buttons[1].pressed || gamepad.buttons[14].pressed) {
            //console.log(`Button B or Left`)
            old_input = old_input & ~(1 << 1)
        } else {
            old_input = old_input & (1 << 1)
        }

        // Up or Select
        if(gamepad.buttons[12].pressed || gamepad.buttons[8].pressed) {
            //console.log(`Button Select or Up`)
            old_input = old_input & ~(1 << 1)
        } else {
            old_input = old_input & (1 << 1)
        }

        // Down or Start
        if(gamepad.buttons[13].pressed || gamepad.buttons[9].pressed) {
            //console.log(`Button Start or Down`)
            old_input = old_input & ~(1 << 1)
        } else {
            old_input = old_input & (1 << 1)
        }

        gamepad_state = old_input
        cpu.requestInterrupt(4)

    }
}