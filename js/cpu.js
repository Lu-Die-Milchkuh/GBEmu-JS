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

    // Interrupt Enable Register
    IE: 0
}

// Some Register can be paired together
cpu.AF = () => {
    return (cpu.A << 8) | cpu.F;
}

cpu.BC = () => {
    return (cpu.B << 8) | cpu.C;
}

cpu.DE = () => {
    return (cpu.D << 8) | cpu.E;
}

cpu.HL = () => {
    return (cpu.H << 8) | cpu.L;
}

cpu.setAF = (data) => {
    cpu.A = (data & 0xFF00) >> 8
    cpu.F = data & 0x00FF
}

cpu.setBC = (data) => {
    cpu.B = (data & 0xFF00) >> 8
    cpu.C = data & 0x00FF
}

cpu.setDE = (data) => {
    cpu.D = (data & 0xFF00) >> 8
    cpu.E = data & 0x00FF
}

cpu.setHL = (data) => {
    cpu.H = (data & 0xFF00) >> 8
    cpu.L = data & 0x00FF
}

// At Startup the Game Boy expects certain Registers and Memory Location to contain the following data
cpu.reset = () => {
    cpu.setAF(0x01B0)
    cpu.setBC(0x0013)
    cpu.setDE(0x00D8)
    cpu.setHL(0x014D)
    cpu.SP = 0xFFFE
    cpu.PC = 0x0000
    memory.write(0x00, 0xFF05)   // TIMA
    memory.write(0x00, 0xFF06)   // TMA
    memory.write(0x00, 0xFF07)   // TAC
    memory.write(0x80, 0xFF10)
    memory.write(0xBF, 0xFF11)
    memory.write(0xF3, 0xFF12)
    memory.write(0xBF, 0xFF14)
    memory.write(0x3F, 0xFF16)
    memory.write(0x00, 0xFF17)
    memory.write(0xBF, 0xFF19)
    memory.write(0x7F, 0xFF1A)
    memory.write(0xFF, 0xFF1B)
    memory.write(0x9F, 0xFF1C)
    memory.write(0xBF, 0xFF1E)
    memory.write(0xFF, 0xFF20)
    memory.write(0x00, 0xFF21)
    memory.write(0x00, 0xFF22)
    memory.write(0xBF, 0xFF23)
    memory.write(0x77, 0xFF24)
    memory.write(0xF3, 0xFF25)
    memory.write(0xF1, 0xFF26)
    memory.write(0x91, 0xFF40)
    memory.write(0x00, 0xFF42)   // LCDC
    memory.write(0x00, 0xFF43)   // SCx
    memory.write(0x00, 0xFF45)   // LYC
    memory.write(0xFC, 0xFF47)   // BGP
    memory.write(0xFF, 0xFF48)   // OBP0
    memory.write(0xFF, 0xFF49)   // OBP1
    memory.write(0x00, 0xFF4A)   // WY
    memory.write(0xFC, 0xFF4B)   // WX
    memory.write(0x00, 0xFFFF)   // IE
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
function ADDCM(data) {
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
function CALL(address) {
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

function SETM(n) {
    let data = memory.read(cpu.HL())
    data |= (1 << n)
    memory.write(data, cpu.HL())
    cpu.PC++
}

// Clear a Bit at position n of register
function RESR(reg8, n) {
    cpu[reg8] &= ~(1 << n)
    cpu.PC++
}

function RESM(n) {
    let data = memory.read(cpu.HL())
    data &= (0 << n)
    memory.write(data, cpu.HL())
    cpu.PC++
}

// Check if a Bit at given index is set
function BIT(index, data) {
    cpu.Z = (data & (1 << index));
    cpu.PC++
}

/*
    Miscellaneous
*/

// No Operation, do nothing
function NOP() {
    cpu.PC++
}

// Complement the Carry Flag: true -> false,false -> true
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
    cpu.IE = 1
    cpu.PC++
}

// Disable Interrupts
function DI() {
    cpu.IE = 0
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

function PUSH(reg16) {
    let highByte = cpu[reg16]() & 0xFF00
    let lowByte = cpu[reg16]() & 0x00FF
    cpu.SP--
    memory.write(highByte, cpu.SP)
    cpu.SP--
    memory.write(lowByte, cpu.SP)
    cpu.PC++
}

function POP(reg16) {
    cpu.SP++
    let lowByte = memory.read(cpu.SP)
    cpu.SP++
    let highByte = memory.read(cpu.SP)
    cpu[`set${reg16}`](highByte << 8 | lowByte)
}