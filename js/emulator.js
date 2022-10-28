"use strict"


let ratio = 1
let running = true
let paused = false



async function run() {
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
            // Opcodes are the Bytes that tell the cpu which instruction it should execute
            let opcode = mmu.read(cpu.PC)
            //console.log(`Executing: ${opcode.toString(16)} @ ${cpu.PC.toString(16)}`)
            let temp_cycles = cpu.clock.cycles

            if (opcode === 0xCB) {
                console.warn(`Prefix CB Instruction!`)
                cpu.PC++;
                opcode = mmu.read(cpu.PC)
                prefix_lookup[opcode]()
            } else {
                lookup[opcode]()
            }

            temp_cycles = cpu.clock.cycles - temp_cycles // Elapsed Cycles
        }
        await new Promise(resolve => setTimeout(resolve, 100))
    }

}
