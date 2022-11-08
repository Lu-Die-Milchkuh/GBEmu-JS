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

export let cpu = {
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

    // Interrupt Master Enable Register
    IME: false,
    // Interrupt Enable
    IE: 0,

    isHalt: false,
    isStop: false,

}

const Interrupts = {
    vblank: 0,
    lcd_stat: 1,
    timer: 2,
    serial: 3,
    joypad: 4
}

// Some Register can be paired together
cpu.AF = () => {
    let F = (cpu.flags.C ? 1 : 0) << 4
    F |= (cpu.flags.N ? 1 : 0) << 6
    F |= (cpu.flags.H ? 1 : 0) << 5
    F |= (cpu.flags.Z ? 1 : 0) << 7

    cpu.F = F
    return (cpu.A << 8) | cpu.F
}

cpu.BC = () => {
    return (cpu.B << 8) | cpu.C
}

cpu.DE = () => {
    return (cpu.D << 8) | cpu.E
}

cpu.HL = () => {
    return (cpu.H << 8) | cpu.L
}

cpu.setAF = (data) => {
    cpu.A = (data & 0xFF00) >> 8
    cpu.F = data & 0x00FF
    cpu.flags.C = (cpu.F & (1 << 4)) === (1 << 4)
    cpu.flags.N = (cpu.F & (1 << 6)) === (1 << 6)
    cpu.flags.H = (cpu.F & (1 << 5)) === (1 << 5)
    cpu.flags.Z = (cpu.F & (1 << 7)) === (1 << 7)
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

/*cpu.setBigEndian = (reg16,address) => {  // Transforming  Little Endian Address(or 16-bit data) into  Big Endian
    let highByte = address & 0x00FF
    let lowByte = address & 0xFF00
    let newAddress = highByte << 8 | lowByte
    cpu[`set${reg16}`](newAddress)
}*/

// Convert Little Endian Data to Big Endian
/*cpu.toBigEndian = (data) => {
    let highByte = data & 0x00FF
    let lowByte = data & 0xFF

    return highByte << 8 | lowByte >> 8
}*/

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
    mmu.write(0xe1, 0xFF0F)   // IF
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
    mmu.write(0x91, 0xFF40)   // LCDC
    mmu.write(0x00, 0xFF42)   // SCY
    mmu.write(0x00, 0xFF43)   // SCX
    mmu.write(0x00, 0xFF45)   // LYC
    mmu.write(0xFC, 0xFF47)   // BGP
    mmu.write(0xFF, 0xFF48)   // OBP0
    mmu.write(0xFF, 0xFF49)   // OBP1
    mmu.write(0x00, 0xFF4A)   // WY
    mmu.write(0xFC, 0xFF4B)   // WX
    mmu.write(0x00, 0xFFFF)   // IE
}

cpu.interruptRoutine = {
    0: () => {
        cpu.RST(0x40) //  VBlank
    },
    1: () => {
        cpu.RST(0x48) // LCD Stat
    },
    2: () => {
        cpu.RST(0x50) // Timer
    },
    3: () => {
        cpu.RST(0x58) // Serial
    },
    4: () => {
        cpu.RST(0x60) // Joypad
    }
}

cpu.checkInterrupt = () => {
    if (!cpu.IME) return
    //mmu.write(0xFF,0xFFFF)
    let int = mmu.read(0xFF0F)

    //console.log(`${int} ${cpu.IE}`)

    for (let i = 0; i < 5; i++) {
        if (int & (1 << i) && cpu.IE & (1 << i)) {    // 1 -> Interrupt Enabled
            console.error(`Interrupt ${i}`)
            int &= (0xFF - (1 << i))
            mmu.write(int, 0xFF0F)
            cpu.interruptRoutine[i]()
            cpu.clock.cycles += 4
            cpu.IME = false
            break
        }
    }
}

cpu.requestInterrupt = (int) => {
    // Interrupt Register is stored at 0xFF0F
    let byte = mmu.read(0xFF0F)
    byte |= (1 << int)
    mmu.write(byte, 0xFF0F)
    cpu.isHalt = false
}

/*
    8 Bit ALU Instructions
 */

// Increment a 8-Bit Register
cpu.INCR8 = (reg8) => {
    cpu[reg8] = (cpu[reg8] + 1) % 256 // Needs to stay in range of an 8-Bit Integer
    cpu.flags.HC = (cpu[reg8] & 0x4)
    cpu.flags.Z = (cpu[reg8] === 0)
    cpu.flags.N = false
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 4
}

// Increment data at the mmu address stored in HL
cpu.INCM8 = () => {
    let address = cpu.HL();
    let data = mmu.read(address)

    data = ((data + 1) >>> 0) % 256
    cpu.flags.HC = (data & 0x4 !== 0)
    cpu.flags.Z = (data === 0)
    cpu.flags.N = false
    mmu.write(data, address)
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 12
}

// Decrement a 8-Bit Register
cpu.DECR8 = (reg8) => {
    cpu[reg8] = ((cpu[reg8] - 1) >>> 0) % 256 // Needs to stay in range of an 8-Bit Integer
    cpu.flags.HC = (cpu[reg8] & 0x4)
    cpu.flags.Z = cpu[reg8] === 0
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 4
}

// Decrement Data at the mmu address stored in HL
cpu.DECM8 = () => {
    let address = cpu.HL();
    let data = mmu.read(address)
    data = ((data - 1) >>> 0) % 256
    cpu.flags.HC = (data & 0x4)
    cpu.flags.Z = (data === 0)

    mmu.write(data, address)
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 12
}

// Bitwise XOR  A with register
cpu.XORR = (reg8) => {
    cpu.A ^= cpu[reg8]
    cpu.flags.Z = (cpu.A === 0)
    cpu.flags.C = false
    cpu.flags.N = false
    cpu.flags.HC = false
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 4
}

// Bitwise XOR A with mmu
cpu.XORM = (data) => {
    cpu.A ^= data
    cpu.flags.Z = (cpu.A === 0)
    cpu.flags.C = false
    cpu.flags.N = false
    cpu.flags.HC = false
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 8
}

// Bitwise OR A with register
cpu.ORR = (reg8) => {
    cpu.A |= cpu[reg8]
    cpu.flags.Z = (cpu.A === 0)
    cpu.flags.C = false
    cpu.flags.N = false
    cpu.flags.HC = false
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 4
}

// Bitwise OR A with mmu
cpu.ORM = (data) => {
    cpu.A |= data
    cpu.flags.Z = (cpu.A === 0)
    cpu.flags.C = false
    cpu.flags.N = false
    cpu.flags.HC = false
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 8
}

// Bitwise AND A with register
cpu.ANDR = (reg8) => {
    cpu.A &= cpu.A
    cpu.flags.Z = (cpu.A === 0)
    cpu.flags.C = false
    cpu.flags.N = false
    cpu.flags.HC = true
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 4
}

// Bitwise AND A with mmu
cpu.ANDM = (data) => {
    cpu.A &= data
    cpu.flags.Z = (cpu.A === 0)
    cpu.flags.C = false
    cpu.flags.N = false
    cpu.flags.HC = true
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 8
}

// Subtract register from A
cpu.SUBR = (reg8) => {
    cpu.flags.N = true
    cpu.flags.C = (cpu.A < cpu[reg8])
    cpu.flags.HC = ((cpu.A - cpu[reg8]) & 0x4)

    cpu.A = ((cpu.A - cpu[reg8]) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 4
}

// Subtract mmu from A
cpu.SUBM = (data) => {
    cpu.flags.N = true
    cpu.flags.C = (cpu.A < data)
    cpu.flags.HC = ((cpu.A - data) & 0x4)

    cpu.A = ((cpu.A - data) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 8
}

// Subtract register and carry flag from A
cpu.SBCR = (reg8) => {
    let carry = cpu.C ? 1 : 0
    cpu.flags.N = true
    cpu.flags.C = (cpu.A < (cpu[reg8] + carry))
    cpu.flags.HC = ((cpu.A - cpu[reg8] - carry) & 0x4)

    cpu.A = ((cpu.A - cpu[reg8] - carry) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 4
}

// Subtract mmu at address and carry from A
cpu.SBCM = (data) => {
    let carry = cpu.flags.C ? 1 : 0

    cpu.flags.N = true
    cpu.flags.C = (cpu.A < (data + carry))
    cpu.flags.HC = ((cpu.A - data - carry) & 0x4)

    cpu.A = ((cpu.A - data - carry) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 8
}

// Add register to A
cpu.ADDR = (reg8) => {
    cpu.flags.N = false
    cpu.flags.C = ((cpu.A + cpu[reg8]) > 255)
    cpu.flags.HC = ((cpu.A + cpu[reg8]) & 0x4)

    cpu.A = ((cpu.A + cpu[reg8]) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 4
}

// Add mmu and carry to A
cpu.ADDM = (data) => {
    cpu.flags.N = false
    cpu.flags.C = ((cpu.A + data) > 255)
    cpu.flags.HC = ((cpu.A + data) & 0x4)

    cpu.A = ((cpu.A + data) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 8
}

// Add register and carry to a
cpu.ADDCR = (reg8) => {
    let carry = cpu.flags.C ? 1 : 0
    cpu.flags.N = false
    cpu.flags.C = ((cpu.A + cpu[reg8] + carry) > 255)
    cpu.flags.HC = ((cpu.A + cpu[reg8] + carry) & 0x4)

    cpu.A = ((cpu.A + cpu[reg8]) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 4
}

// Add mmu and carry to A
cpu.ADDCM = (data) => {
    let carry = cpu.flags.C ? 1 : 0
    cpu.flags.N = false
    cpu.flags.C = ((cpu.A + data + carry) > 255)
    cpu.flags.HC = ((cpu.A + data + carry) & 0x4)

    cpu.A = ((cpu.A + data + carry) >>> 0) % 256
    cpu.flags.Z = (cpu.A === 0)
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 8
}

// Compare A to register, no changes besides flags
cpu.CPR = (reg8) => {
    let temp = cpu.A - cpu[reg8]
    cpu.flags.N = true
    cpu.flags.C = (cpu.A < cpu[reg8])
    cpu.flags.HC = (temp & 0x4)
    cpu.flags.Z = (temp === 0)
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 4
}

// Compare A to mmu, no changes besides flags
cpu.CPM = (data) => {

    let temp = cpu.A - data

    cpu.flags.N = true
    cpu.flags.C = (cpu.A < data)
    cpu.flags.HC = (temp & 0x4)
    cpu.flags.Z = (temp === 0)
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 8
}

/*
    8-Bit Load Instructions
*/

// Load register2 or mmu into register1
cpu.LDR = (reg8, data) => {
    cpu[reg8] = data
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 4
}

// Load mmu or register content into mmu at address
cpu.LDM = (data, address) => {
    mmu.write(data, address)
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 8
}


/*
    Jump Instructions
 */

cpu.JP = (address) => {
    cpu.PC = address
    cpu.clock.cycles += 16
}

// Conditional Jump -> Z,!Z,C,!C
cpu.JPC = (address, condition) => {
    if (condition) {
        cpu.PC = address
        cpu.clock.cycles += 16
    } else {
        cpu.PC = (cpu.PC + 1) % 0x10000
        cpu.clock.cycles += 12
    }
}

// Relative Jump -> PC = PC + offset
cpu.JR = (offset) => {
    cpu.PC = (cpu.PC + 1) % 0x10000
    if (offset & 0x80) {
        cpu.PC = (cpu.PC + (offset - 256)) % 0x10000
    } else {
        cpu.PC = (cpu.PC + offset) % 0x10000
    }


    cpu.clock.cycles += 12
}

cpu.JRC = (offset, condition) => {

    if (condition) {
        // Unsigned Byte!
        if (offset & 0x80) {
            //console.log(`Negative ${offset - 256} (${offset})`)
            cpu.PC = (cpu.PC + 1) % 0x10000
            cpu.PC = (cpu.PC + (offset - 256)) % 0x10000   // Converting to signed integer
        } else {
            cpu.PC = (cpu.PC + 1) % 0x10000
            cpu.PC = (cpu.PC + offset) % 0x10000
        }
        cpu.clock.cycles += 12
    } else {
        cpu.PC = (cpu.PC + 1) % 0x10000
        cpu.clock.cycles += 8
    }

}

// Call Subroutine, original PC will be stored in Stack
cpu.CALL = (address) => {
    cpu.PC = (cpu.PC + 1) % 0x10000
    let highByte = (cpu.PC & 0xFF00) >> 8
    let lowByte = (cpu.PC & 0x00FF)

    console.warn(`Low Byte: ${lowByte.toString(16)}, High Byte: ${highByte.toString(16)}`)

    cpu.SP = (cpu.SP - 1) % 0x10000
    mmu.write(highByte, cpu.SP)
    cpu.SP = (cpu.SP - 1) % 0x10000
    mmu.write(lowByte, cpu.SP)
    cpu.PC = address
    cpu.clock.cycles += 24
}

// Conditional Call to Subroutine
cpu.CALLC = (address, condition) => {
    if (condition) {
        cpu.PC = (cpu.PC + 1) % 0x10000
        let highByte = (cpu.PC & 0xFF00) >> 8
        let lowByte = cpu.PC & 0x00FF

        cpu.SP = (cpu.SP - 1) % 0x10000
        mmu.write(highByte, cpu.SP)
        cpu.SP = (cpu.SP - 1) % 0x10000
        mmu.write(lowByte, cpu.SP)
        cpu.PC = address
        cpu.clock.cycles += 24
    } else {
        cpu.PC = (cpu.PC + 1) % 0x10000
        cpu.clock.cycles += 12
    }
}

// Return from Subroutine
cpu.RET = () => {

    let lowByte = mmu.read(cpu.SP)
    cpu.SP = (cpu.SP + 1) % 0x10000
    let highByte = mmu.read(cpu.SP)
    cpu.SP = (cpu.SP + 1) % 0x10000
    cpu.PC = (highByte << 8 | lowByte)
    cpu.clock.cycles += 16
}

// Conditional Return from Subroutine
cpu.RETC = (condition) => {
    if (condition) {

        let lowByte = mmu.read(cpu.SP)
        cpu.SP++
        let highByte = mmu.read(cpu.SP)
        cpu.SP++
        cpu.PC = (highByte << 8 | lowByte)
        cpu.clock.cycles += 20
    } else {
        cpu.PC = (cpu.PC + 1) % 0x10000
        cpu.clock.cycles += 8
    }

}

// Return from subroutine and enable Interrupts
cpu.RETI = () => {

    let lowByte = mmu.read(cpu.SP)
    cpu.SP = (cpu.SP + 1) % 0x10000
    let highByte = mmu.read(cpu.SP)
    cpu.SP = (cpu.SP + 1) % 0x10000
    cpu.PC = (highByte << 8 | lowByte)
    cpu.IME = true
    cpu.clock.cycles += 16
}

// Jump to 8 Byte Address
cpu.RST = (address) => {
    let highByte = (cpu.PC & 0xFF00) >> 8
    let lowByte = cpu.PC & 0x00FF
    cpu.SP--
    mmu.write(highByte, cpu.SP)
    cpu.SP--
    mmu.write(lowByte, cpu.SP)
    cpu.PC = address
    cpu.clock.cycles += 16
    cpu.IME = false
}

/*
    Single Bit Operation
*/

// Set a Bit at position n of register
cpu.SETR = (reg8, n) => {
    cpu[reg8] |= (1 << n)
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 8
}

cpu.SETM = (n) => {
    let data = mmu.read(cpu.HL())
    data |= (1 << n)
    mmu.write(data, cpu.HL())
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 16
}

// Clear a Bit at position n of register
cpu.RESR = (reg8, n) => {
    cpu[reg8] &= ~(1 << n)
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 8
}

cpu.RESM = (n) => {
    let data = mmu.read(cpu.HL())
    data &= (0 << n)
    mmu.write(data, cpu.HL())
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 16
}

// Check if a Bit at given index is set
cpu.BIT = (index, data) => {
    cpu.Z = (data & (1 << index));
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 8
}

/*
    Miscellaneous
*/

// No Operation, do nothing
cpu.NOP = () => {
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 4
}

cpu.CPL = () => {
    cpu.A = ~cpu.A
    cpu.flags.N = true
    cpu.flags.HC = true
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 4
}

// Complement the Carry Flag: true -> false,false -> true
cpu.CCF = () => {
    cpu.flags.C = !cpu.flags.C
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 4
}

// Set Carry Flag
cpu.SCF = () => {
    cpu.flags.C = true
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 4
}

// Enable Interrupts
cpu.EI = () => {
    cpu.IME = true
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 4
}

// Disable Interrupts
cpu.DI = () => {
    cpu.IME = false
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 4
}

// TODO: Needs to be implemented correctly!
cpu.STOP = () => {
    cpu.clock.cycles += 4
    cpu.isStop = true
}

cpu.HALT = () => {
    cpu.clock.cycles += 4
    cpu.isHalt = true
}


/*
    Rotate and Shift Commands
*/

// Swap nibbles of register
cpu.SWAP = (reg8) => {
    let highNibble = cpu[reg8] & 0xF0
    let lowNibble = cpu[reg8] & 0x0F

    cpu[reg8] = highNibble >> 4 | lowNibble << 4
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 8
}

// Swap nibbles at memory location
cpu.SWAPM = () => {
    let byte = mmu.read(cpu.HL())
    let highNibble = byte & 0xF0
    let lowNibble = byte & 0x0F

    byte = highNibble >> 4 | lowNibble << 4
    mmu.write(byte, cpu.HL())
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 16
}


cpu.RRA = () => {
    cpu.flags.C = !!(cpu.A & 0x1)
    cpu.A = cpu.A >> 1
    cpu.flags.Z = false
    cpu.flags.H = false
    cpu.flags.N = false
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 4
}

// Rotate Left through Carry
cpu.RLCR = (reg8) => {
    cpu.flags.C = !!(cpu[reg8] & 0x80)
    cpu[reg8] = cpu[reg8] << 1
    cpu.flags.Z = cpu[reg8] === 0
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 8

}

cpu.RLCM = () => {
    cpu.clock.cycles += 16
}

// Rotate Right through Carry
cpu.RRCR = (reg8) => {
    cpu.flags.C = !!(cpu[reg8] & 0x1)
    cpu[reg8] = cpu[reg8] >> 1
    cpu.flags.Z = cpu[reg8] === 0
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 8
}

cpu.RRCM = () => {
    let byte = mmu.read(cpu.HL())
    cpu.flags.C = !!(byte & 0x1)
    byte = byte >> 1
    cpu.flags.Z = byte === 0
    mmu.write(byte, cpu.HL())
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 16
}


// Rotate Right
cpu.RRR = (reg8) => {
    let temp = cpu[reg8] & 0x1
    cpu[reg8] = (cpu[reg8] >> 1) | (temp << 7)
    cpu.flags.Z = cpu[reg8] === 0
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 8
}

cpu.RRM = () => {
    let byte = mmu.read(cpu.HL())
    let temp = byte & 0x1
    byte = (byte >> 1) | (temp << 7)
    mmu.write(byte, cpu.HL())
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 16
}

// Rotate Left
cpu.RLR = (reg8) => {
    let temp = cpu[reg8] & 0x80
    cpu[reg8] = (cpu[reg8] << 1) | (temp >> 7)
    cpu.flags.Z = cpu[reg8] === 0
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 8
}

cpu.RLM = () => {
    let byte = mmu.read(cpu.HL())
    let temp = byte & 0x80
    byte = (byte << 1) | (temp >> 7)
    cpu.flags.Z = byte === 0
    mmu.write(byte, cpu.HL())
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 16
}


/*
    16-Bit Instructions
 */

// Push Register to Stack
cpu.PUSH = (reg16) => {
    let highByte = (reg16 & 0xFF00) >> 8
    let lowByte = reg16 & 0x00FF
    cpu.SP = (cpu.SP - 1) % 0x10000
    mmu.write(highByte, cpu.SP)
    cpu.SP = (cpu.SP - 1) % 0x10000
    mmu.write(lowByte, cpu.SP)

    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 16
}

// Get Register back from Stack
cpu.POP = (reg16) => {

    let lowByte = mmu.read(cpu.SP)
    cpu.SP = (cpu.SP + 1) % 0x10000
    let highByte = mmu.read(cpu.SP)
    cpu.SP = (cpu.SP + 1) % 0x10000
    cpu[`set${reg16}`](highByte << 8 | lowByte)
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 12
}

cpu.LDR16 = (reg16, data) => {
    cpu[`set${reg16}`](data)
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 12
}

cpu.LDM16 = (address, data) => {
    mmu.write(data, address)
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 8
}

cpu.INCR16 = (reg16) => {
    let temp = (cpu[`${reg16}`]() + 1) % 0x10000
    cpu[`set${reg16}`](temp)
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 8
}

// Decrement a 16-Bit Register
cpu.DECR16 = (reg16) => {
    let temp = (cpu[`${reg16}`]() - 1) % 0x10000
    cpu[`set${reg16}`](temp)
    cpu.PC = (cpu.PC + 1) % 0x10000
    cpu.clock.cycles += 8
}

cpu.ADDR16 = (dest_reg16, src_reg16) => {
    let temp = cpu[dest_reg16]() + cpu[src_reg16]()
    cpu.flags.C = temp > 0xFFFF
    cpu.flags.N = false
    cpu.flags.H = temp & 0x80
    cpu.flags.Z = (temp % 0x10000) === 0
    temp = temp % 0x10000
    cpu[`set${dest_reg16}`](temp)
    cpu.PC = (cpu.PC + 1) % 0x10000
}