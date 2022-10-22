"use strict"


let cpu = {
    // 8-Bit Register
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    H: 0,
    L: 0,
    // 16-Bit Register
    SP: 0,  // Stack Pointer
    PC: 0,  // Program Counter

    /* CPU State Flags
        Half Carry ->   Check Bit 4 for 8 Bit OP and Bit 7 for 16-Bit OP
        Carry ->        Check Bit 7 for 8-Bit Op and Bit 15 for 16-Bit Op
        Zero -> Op Result was 0
        Subtract -> Op involved a Subtraction
    */
    flags: {
        C: false,   // Carry Flag
        HC: false,  // Half Carry Flag
        Z: false,   // Zero Flag
        N: false,   // Subtract Flag
    },

    // Interrupt Enable
    IE: false
}

// Some Register can be paired together
cpu.AB = () => {
    return (cpu.A << 8) | cpu.B;
}

cpu.CD = () => {
    return (cpu.C << 8) | cpu.D;
}

cpu.EF = () => {
    return (cpu.E << 8) | cpu.F;
}

cpu.HL = () => {
    return (cpu.H << 8) | cpu.L;
}

/*
    8 Bit ALU Instructions
 */

// Increment a 8-Bit Register
function INCR8(reg8) {
    cpu[reg8] = (cpu[reg8] + 1) % 256 // Needs to stay in range of an 8-Bit Integer
    cpu.flags.HC = (cpu[reg8] & 0x4)
    cpu.flags.Z = (cpu[reg8] === 0)
    cpu.PC++
}

// Increment data at the memory address stored in HL
function INCM8() {
    let address = cpu.HL();
    let data = memory.read(address)

    data = ((data + 1) >>> 0) % 256
    cpu.flags.HC = (data & 0x4)
    cpu.flags.Z = (data === 0)

    memory.write(data, address)
    cpu.PC++
}

// Decrement a 8-Bit Register
function DECR8(reg8) {
    cpu[reg8] = ((cpu[reg8] - 1) >>> 0) % 256 // Needs to stay in range of an 8-Bit Integer
    cpu.flags.HC = (cpu[reg8] & 0x4)
    cpu.flags.Z = (cpu[reg8] === 0)
    cpu.PC++
}

// Decrement Data at the memory address stored in HL
function DECM8() {
    let address = cpu.HL();
    let data = memory.read(address)

    data = ((data - 1) >>> 0) % 256
    cpu.flags.HC = (data & 0x4)
    cpu.flags.Z = (data === 0)

    memory.write(data, address)
    cpu.PC++
}

// Bitwise XOR  A with register
function XORR(reg8) {
    cpu.A ^= cpu[reg8]
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
}

// Bitwise XOR A with memory
function XORM(data) {
    cpu.A ^= data
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
}

// Bitwise OR A with register
function ORR(reg8) {
    cpu.A |= cpu[reg8]
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
}

// Bitwise OR A with memory
function ORM(data) {
    cpu.A |= data
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++

}

// Bitwise AND A with register
function ANDR(reg8) {
    cpu.A &= cpu.A
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
}

// Bitwise AND A with memory
function ANDM(data) {
    cpu.A &= data;
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
}

// Subtract register from A
function SUBR(reg8) {
    cpu.flags.N = true
    cpu.flags.C = (cpu.A < cpu[reg8])
    cpu.flags.HC = ((cpu.A - cpu[reg8]) & 0x4)

    cpu.A = ((cpu.A - cpu[reg8]) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
}

// Subtract memory from A
function SUBM(data) {
    cpu.flags.N = true
    cpu.flags.C = (cpu.A < data)
    cpu.flags.HC = ((cpu.A - data) & 0x4)

    cpu.A = ((cpu.A - data) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
}

// Subtract register and carry flag from A
function SBCR(reg8) {
    let carry = cpu.C ? 1 : 0
    cpu.flags.N = true
    cpu.flags.C = (cpu.A < (cpu[reg8] + carry))
    cpu.flags.HC = ((cpu.A - cpu[reg8] - carry) & 0x4)

    cpu.A = ((cpu.A - cpu[reg8] - carry) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
}

// Subtract memory at address and carry from A
function SBCM(data) {
    let carry = cpu.C ? 1 : 0

    cpu.flags.N = true
    cpu.flags.C = (cpu.A < (data + carry))
    cpu.flags.HC = ((cpu.A - data - carry) & 0x4)

    cpu.A = ((cpu.A - data - carry) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
}

// Add register to A
function ADDR(reg8) {
    cpu.flags.N = false
    cpu.flags.C = ((cpu.A + cpu[reg8]) > 255)
    cpu.flags.HC = ((cpu.A + cpu[reg8]) & 0x4)

    cpu.A = ((cpu.A + cpu[reg8]) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
}

// Add memory and carry to A
function ADDM(data) {
    cpu.flags.N = false
    cpu.flags.C = ((cpu.A + data) > 255)
    cpu.flags.HC = ((cpu.A + data) & 0x4)

    cpu.A = ((cpu.A + data) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
}

// Add register and carry to a
function ADDCR(reg8) {
    let carry = cpu.flags.C ? 1 : 0
    cpu.flags.N = false
    cpu.flags.C = ((cpu.A + cpu[reg8] + carry) > 255)
    cpu.flags.HC = ((cpu.A + cpu[reg8] + carry) & 0x4)

    cpu.A = ((cpu.A + cpu[reg8]) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
}

// Add memory and carry to A
function ADCCM(data) {
    let carry = cpu.flags.C ? 1 : 0
    cpu.flags.N = false
    cpu.flags.C = ((cpu.A + data + carry) > 255)
    cpu.flags.HC = ((cpu.A + data + carry) & 0x4)

    cpu.A = ((cpu.A + data + carry) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
}

// Compare A to register, no changes besides flags
function CPR(reg8) {
    let temp = cpu.A - cpu[reg8]

    cpu.flags.N = true
    cpu.flags.C = (cpu.A < cpu[reg8])
    cpu.flags.HC = (temp & 0x4)
    cpu.flags.Z = (temp === 0)
    cpu.PC++
}

// Compare A to memory, no changes besides flags
function CPM(data) {

    let temp = cpu.A - data

    cpu.flags.N = true
    cpu.flags.C = (cpu.A < data)
    cpu.flags.HC = (temp & 0x4)
    cpu.flags.Z = (temp === 0)
    cpu.PC++
}

/*
    8-Bit Load Instructions
*/

// Load register2 or memory into register1
function LDR(reg8, data) {
    cpu[reg8] = data
    cpu.PC++
}

// Load memory or register content into memory at address
function LDM(data, address) {
    memory.write(data, address)
    cpu.PC++
}


/*
    Jump Instructions
 */

function JP(address) {
    cpu.PC = address
}

// Conditional Jump -> Z,!Z,C,!C
function JPC(address, condition) {
    if (condition) {
        cpu.PC = address
    } else {
        cpu.PC++
    }
}

// Relative Jump -> PC = PC + offset
function JR(offset) {
    cpu.PC = (cpu.PC + offset) % 0xFFFF
}

function JRC(offset, condition) {
    if (condition) {
        cpu.PC = (cpu.PC + offset) % 0xFFFF
    } else {
        cpu.PC = (cpu.PC + offset) % 0xFFFF
    }
}

// Call Subroutine, original PC will be stored in Stack
function Call(address) {
    let highByte = cpu.PC & 0xFF00
    let lowByte = cpu.PC & 0x00FF
    cpu.SP--
    memory.write(highByte, cpu.SP)
    cpu.SP--
    memory.write(lowByte, cpu.SP)
    cpu.PC = address
}

// Conditional Call to Subroutine
function CALLC(address, condition) {
    if (condition) {
        let highByte = cpu.PC & 0xFF00
        let lowByte = cpu.PC & 0x00FF
        cpu.SP--
        memory.write(highByte, cpu.SP)
        cpu.SP--
        memory.write(lowByte, cpu.SP)
        cpu.PC = address
    } else {
        cpu.PC++
    }
}

// Return from Subroutine
function RET() {
    cpu.SP++
    let highByte = memory.read(cpu.SP)
    cpu.SP++
    let lowByte = memory.read(cpu.SP)
    cpu.PC = (highByte << 8 | lowByte)

}

// Conditional Return from Subroutine
function RETC(condition) {
    if (condition) {
        cpu.SP++
        let highByte = memory.read(cpu.SP)
        cpu.SP++
        let lowByte = memory.read(cpu.SP)
        cpu.PC = (highByte << 8 | lowByte)
    } else {
        cpu.PC++
    }

}

// Return from subroutine and enable Interrupts
function RETI() {
}

// Jump to 8 Byte Address
function RST(address) {
    cpu.PC = address
}

/*
    Single Bit Operation
*/

// Set a Bit at position n of register
function SETR(reg8, n) {
    cpu[reg8] |= (1 << n)
    cpu.PC++
}

// Clear a Bit at position n of register
function RESR(reg8, n) {
    cpu[reg8] &= ~(1 << n)
    cpu.PC++
}

/*
    Miscellaneous
*/

// No Operation, do nothing
function NOP() {
    cpu.PC++
}

// Clear Carry Flag
function CCF() {
    cpu.flags.C = !cpu.flags.C
    cpu.PC++
}

// Set Carry Flag
function SCF() {
    cpu.flags.C = true
    cpu.PC++
}

// Enable Interrupts
function EI() {
    cpu.IE = true
    cpu.PC++
}

// Disable Interrupts
function DI() {
    cpu.IE = false
    cpu.PC++
}


/*
    Rotate and Shift Commands
*/
function SWAP(reg8) {
    let highNibble = cpu[reg8] & 0xF0
    let lowNibble = cpu[reg8] & 0x0F

    cpu[reg8] = highNibble >> 4 | lowNibble << 4
    cpu.PC++
}

function SWAPHL() {
    let temp = cpu.H
    cpu.H = cpu.L
    cpu.L = temp
    cpu.PC++
}


/*
    16-Bit Instructions
 */
