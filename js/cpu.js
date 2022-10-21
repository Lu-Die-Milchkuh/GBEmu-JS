"use strict"

/* CPU State Flags
    Half Carry ->   Check Bit 4 for 8 Bit OP and Bit 7 for 16-Bit OP
    Carry ->        Check Bit 7 for 8-Bit Op and Bit 15 for 16-Bit Op
    Zero -> Op Result was 0
    Subtract -> Op involved a Subtraction
*/
let flags = {
    C: false,   // Carry Flag
    HC: false,  // Half Carry Flag
    Z: false,   // Zero Flag
    N: false,   // Subtract Flag
}

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
    // CPU State Flags
    flags
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

    memory.write(data,address)
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

    memory.write(data,address)
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
    let carry = cpu.C ? 1:0
    cpu.flags.N = true
    cpu.flags.C = (cpu.A < (cpu[reg8] + carry))
    cpu.flags.HC = ((cpu.A - cpu[reg8] - carry) & 0x4)

    cpu.A = ((cpu.A - cpu[reg8] - carry) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
}

// Subtract memory at address and carry from A
function SBCM(data) {
    let carry = cpu.C ? 1:0

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
    let carry = cpu.flags.C ? 1:0
    cpu.flags.N = false
    cpu.flags.C = ((cpu.A + cpu[reg8] + carry) > 255)
    cpu.flags.HC = ((cpu.A + cpu[reg8] + carry) & 0x4)

    cpu.A = ((cpu.A + cpu[reg8]) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
}

// Add memory and carry to A
function ADCCM(data) {
    let carry = cpu.flags.C ? 1:0
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
function LDR(reg8,data) {
    cpu[reg8] = data
    cpu.PC++
}

// Load memory or register content into memory at address
function LDM(data,address) {
    memory.write(data,address)
    cpu.PC++
}

/*
    Miscellaneous
*/

// No Operation, do nothing
function NOP() {
    cpu.PC++
}

/*
    16-Bit Instructions
 */
