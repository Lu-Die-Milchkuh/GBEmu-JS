"use strict"

import {mmu} from "./mmu.js"
import {cpu} from "./cpu.js"
import {lookup, prefix_lookup} from "./lookup.js"
import {timer} from "./timer.js"

let ratio = 1
export let running = true
export let paused = false

export let setRatio = (value) => {
    ratio = value / 100
    console.log(`Speed Ratio: ${ratio}`)
}

export let setRunning = (cond) => {
    running = cond
}

export let setPaused = (cond) => {
    paused = cond
}


export async function run() {
    const max_cycles = 69905 // 4194304 HZ / 60 HZ
    cpu.reset()

    while (running) {
        while (paused) {
            // sleep
            //console.log("Sleeping...")
            await new Promise(resolve => setTimeout(resolve, 10))
        }
        cpu.clock.cycles = 0;
        while (cpu.clock.cycles <= max_cycles * ratio && !paused && running) {

            let temp_cycles = cpu.clock.cycles

            if(!cpu.isHalt) {
                // Opcodes are the Bytes that tell the cpu which instruction it should execute
                let opcode = mmu.read(cpu.PC)
                console.log(`Executing: ${opcode.toString(16)} @ ${cpu.PC.toString(16)}`)


                if (opcode === 0xCB) {
                    cpu.PC++;
                    opcode = mmu.read(cpu.PC)
                    console.warn(`Prefix CB Instruction: ${opcode.toString(16)}`)
                    prefix_lookup[opcode]()
                } else {
                    lookup[opcode]()
                }
            } else {
                cpu.clock.cycles += 4
            }
            temp_cycles = cpu.clock.cycles - temp_cycles // Elapsed Cycles

            await timer.updateTimer(temp_cycles)
            timer.updateDivTimer(temp_cycles)
            cpu.checkInterrupt()
        }
        await new Promise(resolve => setTimeout(resolve, 100))
    }

}
