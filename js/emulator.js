"use strict"

import {mmu} from "./mmu.js"
import {cpu} from "./cpu.js"
import {lookup, prefix_lookup} from "./lookup.js"
import {timer} from "./timer.js"
import {gpu} from "./gpu.js"
import {screen} from "./screen.js"

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

    screen.init()
    mmu.reset()
    gpu.reset()
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
                    cpu.PC = (cpu.PC + 1) % 0x10000;
                    opcode = mmu.read(cpu.PC)
                    console.warn(`Prefix CB Instruction: ${opcode.toString(16)}`)
                    prefix_lookup[opcode]()
                } else {
                    lookup[opcode]()
                }
            } else {
                cpu.clock.cycles += 4
            }
            if(mmu.read(0xFF02) === 0x81) {
                console.log("Serial")
                serial.push(mmu.read(0xFF01))
                mmu.write(0,0xFF02)
            }
            temp_cycles = cpu.clock.cycles - temp_cycles // Elapsed Cycles
            cpu.checkInterrupt()
            gpu.update(temp_cycles)
            timer.cycles(temp_cycles)
        }
        await new Promise(resolve => setTimeout(resolve, 100))
        console.log(serial)
    }

}
let serial = []