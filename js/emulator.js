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
import {cpu} from "./cpu.js"
import {lookup, prefix_lookup} from "./lookup.js"
import {timer} from "./timer.js"
import {gpu} from "./gpu.js"
import {screen} from "./screen.js"
import {oam} from "./dma.js"
import {updateControls} from "./input.js"

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
    //const frame_time = 16.6 // ms

    screen.init()
    mmu.reset()
    gpu.reset()
    cpu.reset()
    //let counter = 0

    while (running) {
        while (paused) {
            // sleep
            //console.log("Sleeping...")
            await new Promise(resolve => setTimeout(resolve, 10))
        }

        cpu.clock.cycles = 0
        //let start = Date.now()

        while (cpu.clock.cycles <= max_cycles * ratio && !paused && running) {

            let temp_cycles = cpu.clock.cycles

            cpu.update_F()
            if (!cpu.isHalt && !cpu.isStop) { //&& !gpu.vblank
                // Opcodes are the Bytes that tell the cpu which instruction it should execute
                let opcode = mmu.read(cpu.PC)
                cpu.clock.cycles += 4
                //console.log(`Executing: ${opcode.toString(16)} @ ${cpu.PC.toString(16)} Counter: ${counter}`)
                //counter++

                if (opcode === 0xCB) {
                    cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
                    opcode = mmu.read(cpu.PC)
                    //console.warn(`Prefix CB Instruction: ${opcode.toString(16)}`)
                    cpu.clock.cycles += 4
                    prefix_lookup[opcode]()
                } else {
                    lookup[opcode]()
                }

                cpu.update_F()
            } else {
                cpu.clock.cycles += 4
            }
            //cpu.clock.cycles =  (cpu.clock.cycles / 4) >>> 0

            if (mmu.read(0xFF02) === 0x81) {
                console.warn("Serial")
                serial.push(mmu.read(0xFF01))
                mmu.write(0, 0xFF02)
            }
            temp_cycles = cpu.clock.cycles - temp_cycles // Elapsed Cycles
            //console.log(`Elapsed Cycles: ${temp_cycles}`)
            updateControls()
            gpu.update(temp_cycles)
            timer.cycles(temp_cycles)//;printCPUState()
            oam.update(temp_cycles)
            cpu.checkInterrupt()
        }

        /*let end = Date.now() - start
        if (!(end > frame_time)) {
           console.log(`End: ${end}`)
           let remaining = frame_time - end
           await new Promise(resolve => setTimeout(resolve,remaining))
        }*/

        await new Promise(resolve => setTimeout(resolve, 100))
        let foo = ""
        for (let i = 0; i < serial.length; i++) {
            foo += String.fromCharCode(serial[i])
        }
        console.warn(`From Serial: ${foo}`)
        //printCPUState()
        //gpu.frame_buffer.forEach((e) => {console.log(e.values())})
        //let foo2 = gpu.frame_buffer.values()
        //for (let elements of foo2) {
        //    console.log(elements)
        //}

        screen.update()
    }
    //console.log(gpu.frame_buffer)
    //document.querySelector("#test").innerHTML = gg
}

let serial = []

/*let gg = ""
function printCPUState() {
    /*console.warn(`CPU State`)
    console.log(`A -> ${cpu.A.toString(16)}`)
    console.log(`F -> ${cpu.F.toString(16)}`)
    console.log(`B -> ${cpu.B.toString(16)}`)
    console.log(`C -> ${cpu.C.toString(16)}`)
    console.log(`D -> ${cpu.D.toString(16)}`)
    console.log(`E -> ${cpu.E.toString(16)}`)
    console.log(`H -> ${cpu.H.toString(16)}`)
    console.log(`L -> ${cpu.L.toString(16)}`)
    console.log(`SP -> ${cpu.SP.toString(16)}`)
    console.log(`PC -> ${cpu.PC.toString(16)}`)
    console.log("Flags ->")
    console.log(`Z: ${cpu.flags.Z}`)
    console.log(`N: ${cpu.flags.N}`)
    console.log(`N: ${cpu.flags.N}`)
    console.log(`C: ${cpu.flags.C}`)
    gg += `A -> ${cpu.A.toString(16)} <br>`
            +`F -> ${cpu.F.toString(16)} <br>`
            +`B -> ${cpu.B.toString(16)} <br>`
            + `C -> ${cpu.C.toString(16)} <br>`
            + `D -> ${cpu.D.toString(16)} <br>`
            + `E -> ${cpu.E.toString(16)} <br>`
            +`H -> ${cpu.H.toString(16)}<br>`
    +`L -> ${cpu.L.toString(16)}<br>`
    +`SP -> ${cpu.SP.toString(16)}<br>`
    +"Flags -><br>"
    +`Z: ${cpu.flags.Z}<br>`
    +`N: ${cpu.flags.N}<br>`
    +`hc: ${cpu.flags.HC}<br>`
    +`C: ${cpu.flags.C}<br>`


}*/