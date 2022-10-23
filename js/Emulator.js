"use strict"

let ratio = 1
let running = false
let paused = false

function run() {
    cpu.reset()

    while (running) {
        while (paused) {
            // sleep
        }
        let cycles = 0
        while (cycles <= 4194304 * ratio) {
            // Opcodes are the Bytes that tell the cpu which instruction it should execute
            let opcode = memory.read(cpu.PC)
            console.log(`Executing: ${opcode.toString(16)}`)

            if(opcode === 0xCB) {
                cpu.PC++
                opcode = memory.read(cpu.PC)
                prefix_lookup[opcode]()
            }
            else {
                lookup[opcode]()
            }


        }

    }

}