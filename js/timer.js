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

import { mmu } from "./mmu.js"
import { cpu } from "./cpu.js"

/*
    Macros
*/
const DIV = 0xFF04
const TIMA = 0xFF05
const TMA = 0xFF06
const TAC = 0xFF07
const CLOCK_SPEED = 4194304


export let timer = {
    mainTime: 0,
    divTime: 0,
    divider_counter: 0,
    timer_counter: 0,
    frequency: 0
}

timer.cycles = (cycles) => {
    timer.updateDivTimer(cycles)

    let newFreq = timer.getFreq()

    if (timer.frequency !== newFreq) {
        timer.frequency = newFreq
    }

    if (timer.isEnabled()) {
        timer.timer_counter -= cycles
        if (timer.timer_counter <= 0) {
            let timer_value = mmu.read(TIMA)
            timer.setFreq(newFreq)

            if (timer_value === 0xFF) { // Timer will overflow
                let byte = mmu.read(TMA)
                mmu.write(byte, TIMA)
                cpu.requestInterrupt(2)
            } else {
                timer_value++
                mmu.write(timer_value, TIMA)
            }
        }
    }


}

timer.updateDivTimer = (cycles) => {
    timer.divider_counter += cycles

    if (timer.divider_counter >= 256) {
        let newDiv = mmu.read(DIV)
        newDiv = ((newDiv + 1) >>> 0) & 256
        mmu.io_reg[4] = newDiv
        //mmu.write(newDiv,DIV)
        timer.divider_counter = 0
    }
}

timer.setFreq = (freq) => {
    timer.frequency = freq
    timer.timer_counter = CLOCK_SPEED / freq
}

timer.getFreq = () => {
    let mode = mmu.read(TAC) & 3
    let freq = undefined
    switch (mode) {
        case 0:
            freq = 4096
            break
        case 1:
            freq = 262144
            break
        case 2:
            freq = 65536
            break
        case 3:
            freq = 16384
            break
    }

    return freq
}

timer.isEnabled = () => {
    let byte = mmu.read(TAC)
    return (byte & (1 << 2))
}

timer.resetDiv = () => {
    timer.divTime = 0
    mmu.write(0x0, 0xFF04)
}
