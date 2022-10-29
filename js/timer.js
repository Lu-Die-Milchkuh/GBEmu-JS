"use strict"

import {mmu} from "./mmu.js"
import {cpu} from "./cpu.js"
import  {paused,running} from "./emulator.js"

export let timer = {
    mainTime: 0,
    divTime: 0
}

timer.updateTimer = async (cycles) => {
    let tac = mmu.read(0xFF07)

    if (!(tac & 0x4)) return // Timer Enable Bit

    timer.mainTime += cycles

    let threshold = 64

    switch (tac & 0x3) {  // Input Clock Select Bits (0-1)
        case 0:
            threshold = 1024
            break
        case 1:
            threshold = 16
            break
        case 2:
            threshold = 64
            break
        case 3:
            threshold = 256
            break
    }

    while (timer.mainTime >= threshold && running) {
        while(paused) {
            console.log("Timer paused")
            await new Promise(resolve => setTimeout(resolve, 10))
        }
        timer.mainTime -= threshold
        let byte = mmu.read(0xFF05) + 1
        mmu.write(byte, 0xFF05)

        if (byte > 0xFF) {   // Overflow
            let temp = mmu.read(0xFF06)

            mmu.write(temp, 0xFF05)
            cpu.requestInterrupt(2) // Timer Interrupt
        }
    }
    await new Promise(resolve => setTimeout(resolve, 1))
}

timer.updateDivTimer = (cycles) => {
    let divThreshold = 256
    timer.divTime += cycles;
    if (timer.divTime > divThreshold) {
        timer.divTime -= divThreshold;
        let div = mmu.read(0xFF04) + 1
        mmu.write(div & 0xFF, 0xFF04)
    }
}

timer.resetDiv = () => {
    timer.divTime = 0
    mmu.write(0x0,0xFF04)
}