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
    SP: 0xFFFE,  // Stack Pointer
    PC: 0x0100,  // Program Counter

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
    clock: {
        cycles: 0
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

cpu.setSP = (data) => {
    cpu.SP = data
}

// At Startup the Game Boy expects certain Registers and Memory Location to contain the following data
cpu.reset = () => {
    mmu.reset()
    cpu.setAF(0x01B0)
    cpu.setBC(0x0013)
    cpu.setDE(0x00D8)
    cpu.setHL(0x014D)
    cpu.SP = 0xFFFE
    cpu.PC = 0x0100
    mmu.write(0x00, 0xFF05)   // TIMA
    mmu.write(0x00, 0xFF06)   // TMA
    mmu.write(0x00, 0xFF07)   // TAC
    mmu.write(0x80, 0xFF10)
    mmu.write(0xBF, 0xFF11)
    mmu.write(0xF3, 0xFF12)
    mmu.write(0xBF, 0xFF14)
    mmu.write(0x3F, 0xFF16)
    mmu.write(0x00, 0xFF17)
    mmu.write(0xBF, 0xFF19)
    mmu.write(0x7F, 0xFF1A)
    mmu.write(0xFF, 0xFF1B)
    mmu.write(0x9F, 0xFF1C)
    mmu.write(0xBF, 0xFF1E)
    mmu.write(0xFF, 0xFF20)
    mmu.write(0x00, 0xFF21)
    mmu.write(0x00, 0xFF22)
    mmu.write(0xBF, 0xFF23)
    mmu.write(0x77, 0xFF24)
    mmu.write(0xF3, 0xFF25)
    mmu.write(0xF1, 0xFF26)
    mmu.write(0x91, 0xFF40)
    mmu.write(0x00, 0xFF42)   // LCDC
    mmu.write(0x00, 0xFF43)   // SCx
    mmu.write(0x00, 0xFF45)   // LYC
    mmu.write(0xFC, 0xFF47)   // BGP
    mmu.write(0xFF, 0xFF48)   // OBP0
    mmu.write(0xFF, 0xFF49)   // OBP1
    mmu.write(0x00, 0xFF4A)   // WY
    mmu.write(0xFC, 0xFF4B)   // WX
    mmu.write(0x00, 0xFFFF)   // IE
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
    cpu.clock.cycles += 4
}

// Increment data at the mmu address stored in HL
function INCM8() {
    let address = cpu.HL();
    let data = mmu.read(address)

    data = ((data + 1) >>> 0) % 256
    cpu.flags.HC = (data & 0x4)
    cpu.flags.Z = (data === 0)

    mmu.write(data, address)
    cpu.PC++
    cpu.clock.cycles += 12
}

// Decrement a 8-Bit Register
function DECR8(reg8) {
    cpu[reg8] = ((cpu[reg8] - 1) >>> 0) % 256 // Needs to stay in range of an 8-Bit Integer
    cpu.flags.HC = (cpu[reg8] & 0x4)
    cpu.flags.Z = (cpu[reg8] === 0);
    cpu.PC++
    cpu.clock.cycles += 4
}

// Decrement Data at the mmu address stored in HL
function DECM8() {
    let address = cpu.HL();
    let data = mmu.read(address)

    data = ((data - 1) >>> 0) % 256
    cpu.flags.HC = (data & 0x4)
    cpu.flags.Z = (data === 0)

    mmu.write(data, address)
    cpu.PC++
    cpu.clock.cycles += 12
}

// Bitwise XOR  A with register
function XORR(reg8) {
    cpu.A ^= cpu[reg8]
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
    cpu.clock.cycles += 4
}

// Bitwise XOR A with mmu
function XORM(data) {
    cpu.A ^= data
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
    cpu.clock.cycles += 8
}

// Bitwise OR A with register
function ORR(reg8) {
    cpu.A |= cpu[reg8]
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
    cpu.clock.cycles += 4
}

// Bitwise OR A with mmu
function ORM(data) {
    cpu.A |= data
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
    cpu.clock.cycles += 8
}

// Bitwise AND A with register
function ANDR(reg8) {
    cpu.A &= cpu.A
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
    cpu.clock.cycles += 4
}

// Bitwise AND A with mmu
function ANDM(data) {
    cpu.A &= data;
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
    cpu.clock.cycles += 8
}

// Subtract register from A
function SUBR(reg8) {
    cpu.flags.N = true
    cpu.flags.C = (cpu.A < cpu[reg8])
    cpu.flags.HC = ((cpu.A - cpu[reg8]) & 0x4)

    cpu.A = ((cpu.A - cpu[reg8]) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
    cpu.clock.cycles += 4
}

// Subtract mmu from A
function SUBM(data) {
    cpu.flags.N = true
    cpu.flags.C = (cpu.A < data)
    cpu.flags.HC = ((cpu.A - data) & 0x4)

    cpu.A = ((cpu.A - data) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
    cpu.clock.cycles += 8
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
    cpu.clock.cycles += 4
}

// Subtract mmu at address and carry from A
function SBCM(data) {
    let carry = cpu.C ? 1 : 0

    cpu.flags.N = true
    cpu.flags.C = (cpu.A < (data + carry))
    cpu.flags.HC = ((cpu.A - data - carry) & 0x4)

    cpu.A = ((cpu.A - data - carry) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
    cpu.clock.cycles += 8
}

// Add register to A
function ADDR(reg8) {
    cpu.flags.N = false
    cpu.flags.C = ((cpu.A + cpu[reg8]) > 255)
    cpu.flags.HC = ((cpu.A + cpu[reg8]) & 0x4)

    cpu.A = ((cpu.A + cpu[reg8]) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
    cpu.clock.cycles += 4
}

// Add mmu and carry to A
function ADDM(data) {
    cpu.flags.N = false
    cpu.flags.C = ((cpu.A + data) > 255)
    cpu.flags.HC = ((cpu.A + data) & 0x4)

    cpu.A = ((cpu.A + data) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
    cpu.clock.cycles += 8
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
    cpu.clock.cycles += 4
}

// Add mmu and carry to A
function ADDCM(data) {
    let carry = cpu.flags.C ? 1 : 0
    cpu.flags.N = false
    cpu.flags.C = ((cpu.A + data + carry) > 255)
    cpu.flags.HC = ((cpu.A + data + carry) & 0x4)

    cpu.A = ((cpu.A + data + carry) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC++
    cpu.clock.cycles += 8
}

// Compare A to register, no changes besides flags
function CPR(reg8) {
    let temp = cpu.A - cpu[reg8]

    cpu.flags.N = true
    cpu.flags.C = (cpu.A < cpu[reg8])
    cpu.flags.HC = (temp & 0x4)
    cpu.flags.Z = (temp === 0)
    cpu.PC++
    cpu.clock.cycles += 4
}

// Compare A to mmu, no changes besides flags
function CPM(data) {

    let temp = cpu.A - data

    cpu.flags.N = true
    cpu.flags.C = (cpu.A < data)
    cpu.flags.HC = (temp & 0x4)
    cpu.flags.Z = (temp === 0)
    cpu.PC++
    cpu.clock.cycles += 8
}

/*
    8-Bit Load Instructions
*/

// Load register2 or mmu into register1
function LDR(reg8, data) {
    cpu[reg8] = data
    cpu.PC++
    cpu.clock.cycles += 4
}

// Load mmu or register content into mmu at address
function LDM(data, address) {
    mmu.write(data, address)
    cpu.PC++
    cpu.clock.cycles += 8
}


/*
    Jump Instructions
 */

function JP(address) {
    cpu.PC = address
    cpu.clock.cycles += 16
}

// Conditional Jump -> Z,!Z,C,!C
function JPC(address, condition) {
    if (condition) {
        cpu.PC = address
        cpu.clock.cycles += 16
    } else {
        cpu.PC++
        cpu.clock.cycles += 12
    }
}

// Relative Jump -> PC = PC + offset
function JR(offset) {
    cpu.PC = (cpu.PC + offset) % 0xFFFF
    cpu.clock.cycles += 12
}

function JRC(offset, condition) {
    cpu.PC++
    if (condition) {
        // Unsigned Byte!
        if (offset & 0x80) {
            //console.log(`Negative ${offset - 256}`)
            cpu.PC = (cpu.PC + (offset - 256)) % 0xFFFF   // Converting to signed integer
        } else {
            cpu.PC = (cpu.PC + offset) % 0xFFFF
        }
    } else {
        cpu.clock.cycles += 12
    }

}

// Call Subroutine, original PC will be stored in Stack
function CALL(address) {
    //console.warn(`PC is ${cpu.PC.toString(16)}`)
    cpu.PC++
    let highByte = (cpu.PC & 0xFF00) >> 8
    let lowByte = (cpu.PC & 0x00FF) //; console.warn(`Low Byte: ${lowByte}, High Byte: ${highByte}`)
    cpu.SP--
    mmu.write(lowByte, cpu.SP)
    cpu.SP--
    mmu.write(highByte, cpu.SP)
    cpu.PC = address
    cpu.clock.cycles += 24
}

// Conditional Call to Subroutine
function CALLC(address, condition) {
    if (condition) {
        let highByte = cpu.PC & 0xFF00
        let lowByte = cpu.PC & 0x00FF
        cpu.SP--
        mmu.write(lowByte, cpu.SP)
        cpu.SP--
        mmu.write(highByte, cpu.SP)
        cpu.PC = address
        cpu.clock.cycles += 24
    } else {
        cpu.PC++
        cpu.clock.cycles += 12
    }
}

// Return from Subroutine
function RET() {
    cpu.SP++
    let highByte = mmu.read(cpu.SP)
    cpu.SP++
    let lowByte = mmu.read(cpu.SP)
    cpu.PC = (lowByte << 8 | highByte)
    cpu.clock.cycles += 16
}

// Conditional Return from Subroutine
function RETC(condition) {
    if (condition) {
        cpu.SP++
        let highByte = mmu.read(cpu.SP)
        cpu.SP++
        let lowByte = mmu.read(cpu.SP)
        cpu.PC = (lowByte << 8 | highByte)
        cpu.clock.cycles += 20
    } else {
        cpu.PC++
        cpu.clock.cycles += 8
    }

}

// Return from subroutine and enable Interrupts
function RETI() {
    cpu.clock.cycles += 16
}

// Jump to 8 Byte Address
function RST(address) {
    cpu.PC = address
    cpu.clock.cycles += 16
}

/*
    Single Bit Operation
*/

// Set a Bit at position n of register
function SETR(reg8, n) {
    cpu[reg8] |= (1 << n)
    cpu.PC++
    cpu.clock.cycles += 8
}

function SETM(n) {
    let data = mmu.read(cpu.HL())
    data |= (1 << n)
    mmu.write(data, cpu.HL())
    cpu.PC++
    cpu.clock.cycles += 16
}

// Clear a Bit at position n of register
function RESR(reg8, n) {
    cpu[reg8] &= ~(1 << n)
    cpu.PC++
    cpu.clock.cycles += 8
}

function RESM(n) {
    let data = mmu.read(cpu.HL())
    data &= (0 << n)
    mmu.write(data, cpu.HL())
    cpu.PC++
    cpu.clock.cycles += 16
}

// Check if a Bit at given index is set
function BIT(index, data) {
    cpu.Z = (data & (1 << index));
    cpu.PC++
    cpu.clock.cycles += 8
}

/*
    Miscellaneous
*/

// No Operation, do nothing
function NOP() {
    cpu.PC++
    cpu.clock.cycles += 4
}

function CPL() {
    cpu.A = ~cpu.A
    cpu.flags.N = true
    cpu.flags.HC = true
    cpu.PC++
    cpu.clock.cycles += 4
}

// Complement the Carry Flag: true -> false,false -> true
function CCF() {
    cpu.flags.C = !cpu.flags.C
    cpu.PC++
    cpu.clock.cycles += 4
}

// Set Carry Flag
function SCF() {
    cpu.flags.C = true
    cpu.PC++
    cpu.clock.cycles += 4
}

// Enable Interrupts
function EI() {
    cpu.IE = 1
    cpu.PC++
    cpu.clock.cycles += 4
}

// Disable Interrupts
function DI() {
    cpu.IE = 0
    cpu.PC++
    cpu.clock.cycles += 4
}


/*
    Rotate and Shift Commands
*/
function SWAP(reg8) {
    let highNibble = cpu[reg8] & 0xF0
    let lowNibble = cpu[reg8] & 0x0F

    cpu[reg8] = highNibble >> 4 | lowNibble << 4
    cpu.PC++
    cpu.clock.cycles += 8
}

function SWAPHL() {
    let temp = cpu.H
    cpu.H = cpu.L
    cpu.L = temp
    cpu.PC++
    cpu.clock.cycles += 16
}


// Rotate Left through Carry
function RLCR(reg8) {
    cpu.flags.C = (cpu[reg8] & 0x80) ? true : false
    cpu[reg8] = cpu[reg8] << 1
    cpu.flags.Z = cpu[reg8] === 0
    cpu.PC++
    cpu.clock.cycles += 8

}

function RLCM() {
    cpu.clock.cycles += 16
}

// Rotate Right through Carry
function RRCR(reg8) {
    cpu.flags.C = !!(cpu[reg8] & 0x1)
    cpu[reg8] = cpu[reg8] >> 1
    cpu.flags.Z = cpu[reg8] === 0
    cpu.PC++
    cpu.clock.cycles += 8
}

function RRCM() {
    let byte = mmu.read(cpu.HL())
    cpu.flags.C = !!(byte & 0x1)
    byte = byte >> 1
    cpu.flags.Z = byte === 0
    mmu.write(byte,cpu.HL())
    cpu.PC++
    cpu.clock.cycles += 16
}


// Rotate Right
function RRR(reg8) {
    let temp = cpu[reg8] & 0x1
    cpu[reg8] = cpu[reg8] >> 1 | temp << 7
    cpu.flags.Z = cpu[reg8] === 0
    cpu.PC++
    cpu.clock.cycles += 8
}

function RRM() {
    let byte = mmu.read(cpu.HL())
    let temp = byte & 0x1
    byte = byte >> 1 | temp << 7
    mmu.write(byte,cpu.HL())
    cpu.PC++
    cpu.clock.cycles += 16
}

// Rotate Left
function RLR(reg8) {
    let temp = cpu[reg8] & 0x80
    cpu[reg8] = cpu[reg8] << 1 | temp >> 7
    cpu.flags.Z = cpu[reg8] === 0
    cpu.PC++
    cpu.clock.cycles += 8
}

function RLM() {
    let byte = mmu.read(cpu.HL())
    let temp = byte & 0x80
    byte = byte << 1 | temp >> 7
    cpu.flags.Z = byte === 0
    mmu.write(byte,cpu.HL())
    cpu.PC++
    cpu.clock.cycles += 16
}


/*
    16-Bit Instructions
 */

// Push Register to Stack
function PUSH(reg16) {
    let highByte = cpu[reg16]() & 0xFF00
    let lowByte = cpu[reg16]() & 0x00FF
    cpu.SP--
    mmu.write(lowByte, cpu.SP)
    cpu.SP--
    mmu.write(highByte, cpu.SP)
    cpu.PC++
    cpu.clock.cycles += 16
}

// Get Register back from Stack
function POP(reg16) {
    cpu.SP++
    let lowByte = mmu.read(cpu.SP)
    cpu.SP++
    let highByte = mmu.read(cpu.SP)
    cpu[`set${reg16}`](lowByte << 8 | highByte)
    cpu.clock.cycles += 12
}

function LDR16(reg16, data) {
    cpu[`set${reg16}`](data)
    cpu.PC++
    cpu.clock.cycles += 12
}

function LDM16(address, data) {
    mmu.write(data, address)
    cpu.PC++
    cpu.clock.cycles += 8
}

function INCR16(reg16) {
    let temp = (cpu[`${reg16}`] + 1) % 0x10000
    cpu[`set${reg16}`](temp)
    cpu.PC++
    cpu.clock.cycles += 8
}

// Decrement a 16-Bit Register
function DECR16(reg16) {
    let temp = (cpu[`${reg16}`] + 1) % 0x10000
    cpu[`set${reg16}`](temp)
    cpu.PC++
    cpu.clock.cycles += 8
}