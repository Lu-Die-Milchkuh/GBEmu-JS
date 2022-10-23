"use strict"

let ratio = 1
let running = true
let paused = false

async function run() {
    cpu.reset()

    while (running) {
        while (paused) {
            // sleep
            await new Promise(resolve => setTimeout(resolve, 10))

        }
        let cycles = 0;
        while (cycles <= 4194304 * ratio) {
            // Opcodes are the Bytes that tell the cpu which instruction it should execute
            let opcode = memory.read(cpu.PC)
            //console.log(`Executing: ${opcode.toString(16)}`)

            if (opcode === 0xCB) {
                cpu.PC++
                opcode = memory.read(cpu.PC)
                prefix_lookup[opcode]()
                cycles += prefix_cycles_lookup[opcode]
            } else {
                lookup[opcode]()
                cycles += cycles_lookup[opcode]
            }


        }
        await new Promise(resolve => setTimeout(resolve, 1))
    }

}