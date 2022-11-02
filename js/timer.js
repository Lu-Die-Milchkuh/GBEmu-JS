"use strict"

import {mmu} from "./mmu.js"
import {cpu} from "./cpu.js"
import  {paused,running} from "./emulator.js"

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

    if(timer.frequency !== newFreq) {
        timer.frequency = newFreq
    }

    if(timer.isEnabled()) {
        timer.timer_counter -= cycles
        if(timer.timer_counter <= 0) {
            let timer_value = mmu.read(TIMA)
            timer.setFreq(newFreq)

            if(timer_value === 0xFF) { // Timer will overflow
                let byte = mmu.read(TMA)
                mmu.write(byte,TIMA)
                cpu.requestInterrupt(2)
            } else {
                timer_value++
                mmu.write(timer_value,TIMA)
            }
        }
    }


}



timer.updateDivTimer = (cycles) => {
    timer.divider_counter += cycles

    if (timer.divider_counter >= 256) {
        let newDiv = mmu.read(DIV)
        newDiv = (newDiv + 1) & 256
        mmu.write(newDiv,DIV)
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
    return (byte & (1<<2))
}

timer.resetDiv = () => {
    timer.divTime = 0
    mmu.write(0x0,0xFF04)
}