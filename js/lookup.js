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

import {cpu} from "./cpu.js"
import {mmu} from "./mmu.js"

export const lookup = {
    0x00: () => {
        cpu.NOP()
    },
    0x01: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let lowByte = mmu.read(cpu.PC)
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let highByte = mmu.read(cpu.PC)
        let data = highByte << 8 | lowByte
        cpu.LDR16("BC", data)

    },
    0x02: () => {
        cpu.LDM16(cpu.A, cpu.BC())
    },
    0x03: () => {
        cpu.INCR16("BC")
    },
    0x04: () => {
        cpu.INCR8("B")
    },
    0x05: () => {
        cpu.DECR8("B")
    },
    0x06: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let byte = mmu.read(cpu.PC)
        cpu.LDR("B",byte)
        cpu.clock.cycles += 4
    },
    0x07: () => {
        cpu.RLCA()
    },
    0x08: () => {
        // LD (a16), SP
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let lowByte = mmu.read(cpu.PC)
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let highByte = mmu.read(cpu.PC)

        let address = highByte << 8 | lowByte

        let lowSP = cpu.SP & 0x00FF
        let highSP = (cpu.SP % 0xFF00) >> 8

        mmu.write(lowSP, address)
        address++
        mmu.write(highSP, address)
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        cpu.clock.cycles += 20
    },
    0x09: () => {
        cpu.ADDR16("HL", "BC")
    },
    0x0a: () => {
        let byte = mmu.read(cpu.BC())
        cpu.LDR("A", byte)
        cpu.clock.cycles += 4
    },
    0x0b: () => {
        cpu.DECR16("BC")
    },
    0x0c: () => {
        cpu.INCR8("C")
    },
    0x0d: () => {
        cpu.DECR8("C")
    },
    0x0e: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let byte = mmu.read(cpu.PC)
        cpu.LDR("C", byte)
        cpu.clock.cycles += 4
    },
    0x0f: () => {
        cpu.RRCA()
    },
    0x10: () => {
        cpu.STOP()
    },
    0x11: () => {
        // Memory -> Little Endian, the Least Sig Byte comes first
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let lowByte = mmu.read(cpu.PC)
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let highByte = mmu.read(cpu.PC)

        let data = (highByte << 8) | lowByte
        cpu.LDR16("DE", data)
    },
    0x12: () => {
        cpu.LDM(cpu.A, cpu.DE())
    },
    0x13: () => {
        cpu.INCR16("DE")
    },
    0x14: () => {
        cpu.INCR8("D")
    },
    0x15: () => {
        cpu.DECR8("D")
    },
    0x16: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let byte = mmu.read(cpu.PC)
        cpu.LDR("D", byte)
        cpu.clock.cycles += 4
    },
    0x17: () => {
        cpu.RLA()
    },
    0x18: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let offset = mmu.read(cpu.PC)
        cpu.JR(offset)
    },
    0x19: () => {
        cpu.ADDR16("HL","DE")
    },
    0x1a: () => {
        let byte = mmu.read(cpu.DE())
        cpu.LDR("A", byte)
        cpu.clock.cycles += 4
    },
    0x1b: () => {
        cpu.DECR16("DE")
    },
    0x1c: () => {
        cpu.INCR8("E")
    },
    0x1d: () => {
        cpu.DECR8("E")
    },
    0x1e: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let byte = mmu.read(cpu.PC)
        cpu.LDR("E", byte)
        cpu.clock.cycles += 4

    },
    0x1f: () => {
        cpu.RRA()
    },
    0x20: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let offset = mmu.read(cpu.PC)
        //console.log(`Condition ${cpu.flags.Z === false}, ${cpu.flags.Z},Offset: ${offset}`)
        cpu.JRC(offset, cpu.flags.Z === false)
    },
    0x21: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let lowByte = mmu.read(cpu.PC)
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let highByte = mmu.read(cpu.PC)

        let data = (highByte << 8) | lowByte
        cpu.LDR16("HL", data)
    },
    0x22: () => {
        cpu.LDM(cpu.A, cpu.HL())
        let newHL = ((cpu.HL() + 1) >>> 0) % 0x10000
        cpu.setHL(newHL)
    },
    0x23: () => {
        cpu.INCR16("HL")
    },
    0x24: () => {
        cpu.INCR8("H")
    },
    0x25: () => {
        cpu.DECR8("H")
    },
    0x26: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let byte = mmu.read(cpu.PC)
        cpu.LDR("H", byte)
        cpu.clock.cycles += 4
    },
    0x27: () => {
        cpu.DAA()
    },
    0x28: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let offset = mmu.read(cpu.PC)
        cpu.JRC(offset, cpu.flags.Z === true)
    },
    0x29: () => {
        cpu.ADDR16("HL", "HL")
    },
    0x2a: () => {
        let byte = mmu.read(cpu.HL())
        cpu.LDR("A", byte)
        let newHL = ((cpu.HL() + 1) >>> 0) % 0x10000
        cpu.setHL(newHL)
        cpu.clock.cycles += 4
    },
    0x2b: () => {
        cpu.DECR16("HL")
    },
    0x2c: () => {
        cpu.INCR8("L")
    },
    0x2d: () => {
        cpu.DECR8("L")
    },
    0x2e: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let byte = mmu.read(cpu.PC)
        cpu.LDR("L", byte)
    },
    0x2f: () => {
        cpu.CPL()
    },
    0x30: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let offset = mmu.read(cpu.PC)
        cpu.JRC(offset, cpu.flags.C === false)
    },
    0x31: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let lowByte = mmu.read(cpu.PC)
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let highByte = mmu.read(cpu.PC)
        //console.error(`Error ${(highByte << 8 | lowByte).toString(16)} PC ${cpu.PC.toString(16)}`)
        cpu.LDR16("SP", highByte << 8 | lowByte)
    },
    0x32: () => {
        cpu.LDM(cpu.A, cpu.HL())
        let newHL = ((cpu.HL() - 1) >>> 0) % 0x10000
        cpu.setHL(newHL)
    },
    0x33: () => {
        cpu.INCR_SP()
    },
    0x34: () => {
        // INC (HL) -> Inc byte at address stored in HL
        let byte = mmu.read(cpu.HL())

        cpu.flags.N = false
        cpu.flags.HC = ((byte & 0xF) + 1) > 0xF

        byte = ((byte + 1) >>> 0) % 256
        mmu.write(byte, cpu.HL())

        cpu.flags.Z = (byte === 0)

        cpu.clock.cycles += 12
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
    },
    0x35: () => {

        // DEC (HL) -> DEC byte at address stored in HL
        let byte = mmu.read(cpu.HL())

        cpu.flags.N = true
        cpu.flags.HC = ((byte & 0xF) - 1) < 0

        byte = ((byte - 1) >>> 0) % 256
        mmu.write(byte, cpu.HL())

        cpu.flags.Z = (byte === 0)
        cpu.clock.cycles += 12
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
    },
    0x36: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let byte = mmu.read(cpu.PC)
        cpu.LDM(byte, cpu.HL())
        cpu.clock.cycles += 4
    },
    0x37: () => {
        cpu.SCF()
    },
    0x38: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let offset = mmu.read(cpu.PC)
        cpu.JRC(offset, cpu.flags.C === true)
    },
    0x39: () => {
        // TODO -> ADD HL,SP
        cpu.ADD_HL(cpu.SP)
    },
    0x3a: () => {
        cpu.LDR("A", mmu.read(cpu.HL()))
        let newHL = ((cpu.HL() - 1) >>> 0) % 0x10000
        cpu.setHL(newHL)
        cpu.clock.cycles += 4
    },
    0x3b: () => {
        cpu.DEC_SP()
    },
    0x3c: () => {
        cpu.INCR8("A")
    },
    0x3d: () => {
        cpu.DECR8("A")
    },
    0x3e: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let byte = mmu.read(cpu.PC)
        cpu.LDR("A", byte)
        //console.log(`0x3e ${byte} ${mmu.read(cpu.PC-2)} PC ${cpu.PC.toString(16)}`)
        cpu.clock.cycles += 4
    },
    0x3f: () => {
        cpu.CCF()
    },
    0x40: () => {
        cpu.LDR("B", cpu.B)
    },
    0x41: () => {
        cpu.LDR("B", cpu.C)
    },
    0x42: () => {
        cpu.LDR("B", cpu.D)
    },
    0x43: () => {
        cpu.LDR("B", cpu.E)
    },
    0x44: () => {
        cpu.LDR("B", cpu.H)
    },
    0x45: () => {
        cpu.LDR("B", cpu.L)
    },
    0x46: () => {
        let byte = mmu.read(cpu.HL())
        cpu.LDR("B", byte)
        cpu.clock.cycles += 4
    },
    0x47: () => {
        cpu.LDR("B", cpu.A)
    },
    0x48: () => {
        cpu.LDR("C", cpu.B)
    },
    0x49: () => {
        cpu.LDR("C", cpu.C)
    },
    0x4a: () => {
        cpu.LDR("C", cpu.D)
    },
    0x4b: () => {
        cpu.LDR("C", cpu.E)
    },
    0x4c: () => {
        cpu.LDR("C", cpu.H)
    },
    0x4d: () => {
        cpu.LDR("C", cpu.L)
    },
    0x4e: () => {
        let byte = mmu.read(cpu.HL())
        cpu.LDR("C", byte)
        cpu.clock.cycles += 4
    },
    0x4f: () => {
        cpu.LDR("C", cpu.A)
    },
    0x50: () => {
        cpu.LDR("D", cpu.B)
    },
    0x51: () => {
        cpu.LDR("D", cpu.C)
    },
    0x52: () => {
        cpu.LDR("D", cpu.D)
    },
    0x53: () => {
        cpu.LDR("D", cpu.E)
    },
    0x54: () => {
        cpu.LDR("D", cpu.H)
    },
    0x55: () => {
        cpu.LDR("D", cpu.L)
    },
    0x56: () => {
        let byte = mmu.read(cpu.HL())
        cpu.LDR("D", byte)
        cpu.clock.cycles += 4
    },
    0x57: () => {
        cpu.LDR("D", cpu.A)
    },
    0x58: () => {
        cpu.LDR("E", cpu.B)
    },
    0x59: () => {
        cpu.LDR("E", cpu.C)
    },
    0x5a: () => {
        cpu.LDR("E", cpu.D)
    },
    0x5b: () => {
        cpu.LDR("E", cpu.E)
    },
    0x5c: () => {
        cpu.LDR("E", cpu.H)
    },
    0x5d: () => {
        cpu.LDR("E", cpu.L)
    },
    0x5e: () => {
        let byte = mmu.read(cpu.HL())
        cpu.LDR("E", byte)
        cpu.clock.cycles += 4
    },
    0x5f: () => {
        cpu.LDR("E", cpu.A)
    },
    0x60: () => {
        cpu.LDR("H", cpu.B)
    },
    0x61: () => {
        cpu.LDR("H", cpu.C)
    },
    0x62: () => {
        cpu.LDR("H", cpu.D)
    },
    0x63: () => {
        cpu.LDR("H", cpu.E)
    },
    0x64: () => {
        cpu.LDR("H", cpu.H)
    },
    0x65: () => {
        cpu.LDR("H", cpu.L)
    },
    0x66: () => {
        let byte = mmu.read(cpu.HL())
        cpu.LDR("H", byte)
        cpu.clock.cycles += 4
    },
    0x67: () => {
        cpu.LDR("H", cpu.A)
    },
    0x68: () => {
        cpu.LDR("L", cpu.B)
    },
    0x69: () => {
        cpu.LDR("L", cpu.C)
    },
    0x6a: () => {
        cpu.LDR("L", cpu.D)
    },
    0x6b: () => {
        cpu.LDR("L", cpu.E)
    },
    0x6c: () => {
        cpu.LDR("L", cpu.H)
    },
    0x6d: () => {
        cpu.LDR("L", cpu.L)
    },
    0x6e: () => {
        let byte = mmu.read(cpu.HL())
        cpu.LDR("L", byte)
        cpu.clock.cycles += 4
    },
    0x6f: () => {
        cpu.LDR("L", cpu.A)
    },
    0x70: () => {
        cpu.LDM(cpu.B, cpu.HL())
    },
    0x71: () => {
        cpu.LDM(cpu.C, cpu.HL())
    },
    0x72: () => {
        cpu.LDM(cpu.D, cpu.HL())
    },
    0x73: () => {
        cpu.LDM(cpu.E, cpu.HL())
    },
    0x74: () => {
        cpu.LDM(cpu.H, cpu.HL())
    },
    0x75: () => {
        cpu.LDM(cpu.L, cpu.HL())
    },
    0x76: () => {
        cpu.HALT()
    },
    0x77: () => {
        cpu.LDM(cpu.A, cpu.HL())
    },
    0x78: () => {
        cpu.LDR("A", cpu.B)
    },
    0x79: () => {
        cpu.LDR("A", cpu.C)
    },
    0x7a: () => {
        cpu.LDR("A", cpu.D)
    },
    0x7b: () => {
        cpu.LDR("A", cpu.E)
    },
    0x7c: () => {
        cpu.LDR("A", cpu.H)
    },
    0x7d: () => {
        cpu.LDR("A", cpu.L)
    },
    0x7e: () => {
        let byte = mmu.read(cpu.HL())
        cpu.LDR("A", byte)
        cpu.clock.cycles += 4
    },
    0x7f: () => {
        cpu.LDR("A", cpu.A)
    },
    0x80: () => {
        cpu.ADDR("B")
    },
    0x81: () => {
        cpu.ADDR("C")
    },
    0x82: () => {
        cpu.ADDR("D")
    },
    0x83: () => {
        cpu.ADDR("E")
    },
    0x84: () => {
        cpu.ADDR("H")
    },
    0x85: () => {
        cpu.ADDR("L")
    },
    0x86: () => {
        cpu.ADDM(mmu.read(cpu.HL()))
    },
    0x87: () => {
        cpu.ADDR("A")
    },
    0x88: () => {
        cpu.ADDCR("B")
    },
    0x89: () => {
        cpu.ADDCR("C")
    },
    0x8a: () => {
        cpu.ADDCR("D")
    },
    0x8b: () => {
        cpu.ADDCR("E")
    },
    0x8c: () => {
        cpu.ADDCR("H")
    },
    0x8d: () => {
        cpu.ADDCR("L")
    },
    0x8e: () => {
        cpu.ADDCM(mmu.read(cpu.HL()))
    },
    0x8f: () => {
        cpu.ADDCR("A")
    },
    0x90: () => {
        cpu.SUBR("B")
    },
    0x91: () => {
        cpu.SUBR("C")
    },
    0x92: () => {
        cpu.SUBR("D")
    },
    0x93: () => {
        cpu.SUBR("E")
    },
    0x94: () => {
        cpu.SUBR("H")
    },
    0x95: () => {
        cpu.SUBR("L")
    },
    0x96: () => {
        cpu.SUBM(mmu.read(cpu.HL()))
    },
    0x97: () => {
        cpu.SUBR("A")
    },
    0x98: () => {
        cpu.SBCR("B")
    },
    0x99: () => {
        cpu.SBCR("C")
    },
    0x9a: () => {
        cpu.SBCR("D")
    },
    0x9b: () => {
        cpu.SBCR("E")
    },
    0x9c: () => {
        cpu.SBCR("H")
    },
    0x9d: () => {
        cpu.SBCR("L")
    },
    0x9e: () => {
        cpu.SBCM(mmu.read(cpu.HL()))
    },
    0x9f: () => {
        cpu.SBCR("A")
    },
    0xa0: () => {
        cpu.ANDR("B")
    },
    0xa1: () => {
        cpu.ANDR("C")
    },
    0xa2: () => {
        cpu.ANDR("D")
    },
    0xa3: () => {
        cpu.ANDR("E")
    },
    0xa4: () => {
        cpu.ANDR("H")
    },
    0xa5: () => {
        cpu.ANDR("L")
    },
    0xa6: () => {
        cpu.ANDM(mmu.read(cpu.HL()))
    },
    0xa7: () => {
        cpu.ANDR("A")
    },
    0xa8: () => {
        cpu.XORR("B")
    },
    0xa9: () => {
        cpu.XORR("C")
    },
    0xaa: () => {
        cpu.XORR("D")
    },
    0xab: () => {
        cpu.XORR("E")
    },
    0xac: () => {
        cpu.XORR("H")
    },
    0xad: () => {
        cpu.XORR("L")
    },
    0xae: () => {
        let byte = mmu.read(cpu.HL())
        cpu.XORM(byte)
    },
    0xaf: () => {
        cpu.XORR("A")
    },
    0xb0: () => {
        cpu.ORR("B")
    },
    0xb1: () => {
        cpu.ORR("C")
    },
    0xb2: () => {
        cpu.ORR("D")
    },
    0xb3: () => {
        cpu.ORR("E")
    },
    0xb4: () => {
        cpu.ORR("H")
    },
    0xb5: () => {
        cpu.ORR("L")
    },
    0xb6: () => {
        let byte = mmu.read(cpu.HL())
        cpu.ORM(byte)
    },
    0xb7: () => {
        cpu.ORR("A")
    },
    0xb8: () => {
        cpu.CPR("B")
    },
    0xb9: () => {
        cpu.CPR("C")
    },
    0xba: () => {
        cpu.CPR("D")
    },
    0xbb: () => {
        cpu.CPR("E")
    },
    0xbc: () => {
        cpu.CPR("H")
    },
    0xbd: () => {
        cpu.CPR("L")
    },
    0xbe: () => {
        let byte = mmu.read(cpu.HL())
        cpu.CPM(byte)
    },
    0xbf: () => {
        cpu.CPR("A")
    },
    0xc0: () => {
        cpu.RETC(cpu.flags.Z === false)
    },
    0xc1: () => {
        cpu.POP("BC")
    },
    0xc2: () => {
        // Memory -> Little Endian, the Least Sig Byte comes first
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let lowByte = mmu.read(cpu.PC)
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let highByte = mmu.read(cpu.PC)
        cpu.JPC(highByte << 8 | lowByte, cpu.flags.Z === false)
    },
    0xc3: () => {
        // Memory -> Little Endian, the Least Sig Byte comes first
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let lowByte = mmu.read(cpu.PC)
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let highByte = mmu.read(cpu.PC)

        console.log(`C3: Jumping to ${(highByte << 8 | lowByte).toString(16)}`)
        cpu.JP((highByte << 8) | lowByte)
    },
    0xc4: () => {
        // Memory -> Little Endian, the Least Sig Byte comes first
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let lowByte = mmu.read(cpu.PC)
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let highByte = mmu.read(cpu.PC)
        cpu.CALLC(highByte << 8 | lowByte, cpu.flags.Z === false)
    },
    0xc5: () => {
        cpu.PUSH(cpu.BC())
    },
    0xc6: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let data = mmu.read(cpu.PC)
        cpu.ADDM(data)
    },
    0xc7: () => {
        cpu.RST(0x00)
    },
    0xc8: () => {
        cpu.RETC(cpu.flags.Z === true)
    },
    0xc9: () => {
        cpu.RET()
    },
    0xca: () => {
        // Memory -> Little Endian, the Least Sig Byte comes first
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let lowByte = mmu.read(cpu.PC)
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let highByte = mmu.read(cpu.PC)

        cpu.JPC(highByte << 8 | lowByte, cpu.flags.Z === true)
    },
    0xcb: () => {
        console.error("CB Prefix used in wrong lookup table!")
    },
    0xcc: () => {
        // Memory -> Little Endian, the Least Sig Byte comes first
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let lowByte = mmu.read(cpu.PC)
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let highByte = mmu.read(cpu.PC)

        cpu.CALLC(highByte << 8 | lowByte, cpu.flags.Z === true)
    },
    0xcd: () => {
        // Memory -> Little Endian, the Least Sig Byte comes first
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let lowByte = mmu.read(cpu.PC)
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let highByte = mmu.read(cpu.PC)

        cpu.CALL(highByte << 8 | lowByte)
    },
    0xce: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let byte = mmu.read(cpu.PC)

        cpu.ADDCM(byte)
    },
    0xcf: () => {
        cpu.RST(0x08)
    },
    0xd0: () => {
        cpu.RETC(cpu.flags.C === false)
    },
    0xd1: () => {
        cpu.POP("DE")
    },
    0xd2: () => {
        // Memory -> Little Endian, the Least Sig Byte comes first
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let lowByte = mmu.read(cpu.PC)
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let highByte = mmu.read(cpu.PC)

        cpu.JPC(highByte << 8 | lowByte, cpu.flags.C === false)
    },
    0xd3: () => {
        console.error("Illegal Opcode!")
    },
    0xd4: () => {
        // Memory -> Little Endian, the Least Sig Byte comes first
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let lowByte = mmu.read(cpu.PC)
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let highByte = mmu.read(cpu.PC)

        cpu.CALLC(highByte << 8 | lowByte, cpu.flags.C === false)
    },
    0xd5: () => {
        cpu.PUSH(cpu.DE())
    },
    0xd6: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let data = mmu.read(cpu.PC)
        cpu.SUBM(data)
        //console.log(`D6 Inst: ${cpu.flags.C}`)
    },
    0xd7: () => {
        cpu.RST(0x10)
    },
    0xd8: () => {
        cpu.RETC(cpu.flags.C === true)
    },
    0xd9: () => {
        cpu.RETI()
    },
    0xda: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let lowByte = mmu.read(cpu.PC)
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let highByte = mmu.read(cpu.PC)

        cpu.JPC(highByte << 8 | lowByte, cpu.flags.C === true)
    },
    0xdb: () => {
        console.error("Illegal Opcode!")
    },
    0xdc: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let lowByte = mmu.read(cpu.PC)
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let highByte = mmu.read(cpu.PC)

        cpu.CALLC(highByte << 8 | lowByte, cpu.flags.C === true)
    },
    0xdd: () => {
        console.error("Illegal Opcode!")
    },
    0xde: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let data = mmu.read(cpu.PC)
        cpu.SBCM(data)
        //cpu.PC = (cpu.PC + 1) % 0x10000
    },
    0xdf: () => {
        cpu.RST(0x18)
    },
    0xe0: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let byte = mmu.read(cpu.PC)
        let offset = 0xFF00 | byte
        cpu.LDM(cpu.A, offset)
        cpu.clock.cycles += 4
    },
    0xe1: () => {
        cpu.POP("HL")
    },
    0xe2: () => {
        let address = 0xFF00 | cpu.C
        cpu.LDM(cpu.A, address)
    },
    0xe3: () => {
        console.error("Illegal Opcode!")
    },
    0xe4: () => {
        console.error("Illegal Opcode!")
    },
    0xe5: () => {
        console.log(`Push HL ${cpu.HL().toString(16)}`)
        cpu.PUSH(cpu.HL())
    },
    0xe6: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let byte = mmu.read(cpu.PC)
        cpu.ANDM(byte)

    },
    0xe7: () => {
        cpu.RST(0x20)
    },
    0xe8: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let byte = mmu.read(cpu.PC)

        cpu.ADD_SP(byte)
    },
    0xe9: () => {
        let address = cpu.HL()
        cpu.JP(address)
        cpu.clock.cycles -= 12
    },
    0xea: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let lowByte = mmu.read(cpu.PC)
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let highByte = mmu.read(cpu.PC)
        let address = highByte << 8 | lowByte
        cpu.LDM(cpu.A, address)
        cpu.clock.cycles += 8
    },
    0xeb: () => {
        console.error("Illegal Opcode!")
    },
    0xec: () => {
        console.error("Illegal Opcode!")
    },
    0xed: () => {
        console.error("Illegal Opcode!")
    },
    0xee: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let data = mmu.read(cpu.PC)
        cpu.XORM(data)
    },
    0xef: () => {
        cpu.RST(0x28)
    },
    0xf0: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let byte = mmu.read(cpu.PC)
        let offset = 0xFF00 | byte
        let data = mmu.read(offset)
        //console.log(offset.toString(16))
        cpu.LDR("A", data)
        //console.error(`OP 0xF0 Address ${offset.toString(16)}: ${mmu.read((offset))}`)
        cpu.clock.cycles += 8

    },
    0xf1: () => {
        cpu.POP("AF")
        cpu.update_Flags()
    },
    0xf2: () => {
        let offset = 0xFF00 | cpu.C
        let data = mmu.read(offset)
        cpu.LDR("A", data)
        cpu.clock.cycles += 4
    },
    0xf3: () => {
        cpu.DI()
    },
    0xf4: () => {
        console.error("Illegal Opcode!")
    },
    0xf5: () => {
        cpu.update_F()
        cpu.PUSH(cpu.AF())
    },
    0xf6: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let byte = mmu.read(cpu.PC)
        cpu.ORM(byte)
    },
    0xf7: () => {
        cpu.RST(0x30)
    },
    0xf8: () => {
        // Note byte is a signed integer!
        // LD HL, SP + byte
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let byte = mmu.read(cpu.PC)
        let SP = cpu.SP

        if (byte > 127) {
            byte =  byte - 256
        }

        SP += byte

        cpu.flags.Z = false
        cpu.flags.N = false
        cpu.flags.HC = (SP & 0xF) < (cpu.SP & 0xF)
        cpu.flags.C = (SP & 0xFF) < (cpu.SP & 0xFF)
        cpu.LDR16("HL", SP)
        //cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
    },
    0xf9: () => {

        cpu.SP = cpu.HL()
        cpu.clock.cycles += 8
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
    },
    0xfa: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let lowByte = mmu.read(cpu.PC)
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let highByte = mmu.read(cpu.PC)

        let address = highByte << 8 | lowByte
        let data = mmu.read(address)
        cpu.LDR("A", data)
        cpu.clock.cycles += 12

    },
    0xfb: () => {
        cpu.EI()
    },
    0xfc: () => {
        console.error("Illegal Opcode!")
    },
    0xfd: () => {
        console.error("Illegal Opcode!")
    },
    0xfe: () => {
        cpu.PC = ((cpu.PC + 1) >>> 0) % 0x10000
        let byte = mmu.read(cpu.PC)
        cpu.CPM(byte)
    },
    0xff: () => {
        cpu.RST(0x38)
    }
}

// Prefix -> 0xCB -> next byte will indicate the instruction that should be executed
export const prefix_lookup = {
    0x00: () => {
        cpu.RLCR("B")
    },
    0x01: () => {
        cpu.RLCR("C")
    },
    0x02: () => {
        cpu.RLCR("D")
    },
    0x03: () => {
        cpu.RLCR("E")
    },
    0x04: () => {
        cpu.RLCR("H")
    },
    0x05: () => {
        cpu.RLCR("L")
    },
    0x06: () => {
        cpu.RLCM()
    },
    0x07: () => {
        cpu.RLCR("A")
    },
    0x08: () => {
        cpu.RRCR("B")
    },
    0x09: () => {
        cpu.RRCR("C")
    },
    0x0a: () => {
        cpu.RRCR("D")
    },
    0x0b: () => {
        cpu.RRCR("E")
    },
    0x0c: () => {
        cpu.RRCR("H")
    },
    0x0d: () => {
        cpu.RRCR("L")
    },
    0x0e: () => {
        cpu.RRCM()
    },
    0x0f: () => {
        cpu.RRCR("A")
    },
    0x10: () => {
        cpu.RLR("B")
    },
    0x11: () => {
        cpu.RLR("C")
    },
    0x12: () => {
        cpu.RLR("D")
    },
    0x13: () => {
        cpu.RLR("E")
    },
    0x14: () => {
        cpu.RLR("H")
    },
    0x15: () => {
        cpu.RLR("L")
    },
    0x16: () => {
        cpu.RLM()
    },
    0x17: () => {
        cpu.RLR("A")
    },
    0x18: () => {
        cpu.RRR("B")
    },
    0x19: () => {
        cpu.RRR("C")
    },
    0x1a: () => {
        cpu.RRR("D")
    },
    0x1b: () => {
        cpu.RRR("E")
    },
    0x1c: () => {
        cpu.RRR("H")
    },
    0x1d: () => {
        cpu.RRR("L")
    },
    0x1e: () => {
        cpu.RRM()
    },
    0x1f: () => {
        cpu.RRR("A")
    },
    0x20: () => {
    },
    0x21: () => {
    },
    0x22: () => {
    },
    0x23: () => {
    },
    0x24: () => {
    },
    0x25: () => {
    },
    0x26: () => {
    },
    0x27: () => {
    },
    0x28: () => {
    },
    0x29: () => {
    },
    0x2a: () => {
    },
    0x2b: () => {
    },
    0x2c: () => {
    },
    0x2d: () => {
    },
    0x2e: () => {
    },
    0x2f: () => {
    },
    0x30: () => {
        cpu.SWAP("B")
    },
    0x31: () => {
        cpu.SWAP("C")
    },
    0x32: () => {
        cpu.SWAP("D")
    },
    0x33: () => {
        cpu.SWAP("E")
    },
    0x34: () => {
        cpu.SWAP("H")
    },
    0x35: () => {
        cpu.SWAP("L")
    },
    0x36: () => {
        cpu.SWAP()
    },
    0x37: () => {
        cpu.SWAP("A")
    },
    0x38: () => {
        cpu.SRLR("B")
    },
    0x39: () => {
    },
    0x3a: () => {
    },
    0x3b: () => {

    },
    0x3c: () => {
    },
    0x3d: () => {
    },
    0x3e: () => {
    },
    0x3f: () => {
    },
    0x40: () => {
        cpu.BIT(0, cpu.B)
    },
    0x41: () => {
        cpu.BIT(0, cpu.C)
    },
    0x42: () => {
        cpu.BIT(0, cpu.D)
    },
    0x43: () => {
        cpu.BIT(0, cpu.E)
    },
    0x44: () => {
        cpu.BIT(0, cpu.H)
    },
    0x45: () => {
        cpu.BIT(0, cpu.L)
    },
    0x46: () => {
        cpu.BIT(0, mmu.read(cpu.HL()))
        cpu.clock.cycles += 8
    },
    0x47: () => {
        cpu.BIT(0, cpu.A)
    },
    0x48: () => {
        cpu.BIT(1, cpu.B)
    },
    0x49: () => {
        cpu.BIT(1, cpu.C)
    },
    0x4a: () => {
        cpu.BIT(1, cpu.D)
    },
    0x4b: () => {
        cpu.BIT(1, cpu.E)
    },
    0x4c: () => {
        cpu.BIT(1, cpu.H)
    },
    0x4d: () => {
        cpu.BIT(1, cpu.L)
    },
    0x4e: () => {
        cpu.BIT(1, mmu.read(cpu.HL()))
        cpu.clock.cycles += 8
    },
    0x4f: () => {
        cpu.BIT(1, cpu.A)
    },
    0x50: () => {
        cpu.BIT(2, cpu.B)
    },
    0x51: () => {
        cpu.BIT(2, cpu.C)
    },
    0x52: () => {
        cpu.BIT(2, cpu.D)
    },
    0x53: () => {
        cpu.BIT(2, cpu.E)
    },
    0x54: () => {
        cpu.BIT(2, cpu.H)
    },
    0x55: () => {
        cpu.BIT(2, cpu.L)
    },
    0x56: () => {
        cpu.BIT(2, mmu.read(cpu.HL()))
        cpu.clock.cycles += 8
    },
    0x57: () => {
        cpu.BIT(2, cpu.A)
    },
    0x58: () => {
        cpu.BIT(3, cpu.B)
    },
    0x59: () => {
        cpu.BIT(3, cpu.C)
    },
    0x5a: () => {
        cpu.BIT(3, cpu.D)
    },
    0x5b: () => {
        cpu.BIT(3, cpu.E)
    },
    0x5c: () => {
        cpu.BIT(3, cpu.H)
    },
    0x5d: () => {
        cpu.BIT(3, cpu.L)
    },
    0x5e: () => {
        cpu.BIT(3, mmu.read(cpu.HL()))
        cpu.clock.cycles += 8
    },
    0x5f: () => {
        cpu.BIT(3, cpu.A)
    },
    0x60: () => {
        cpu.BIT(4, cpu.B)
    },
    0x61: () => {
        cpu.BIT(4, cpu.C)
    },
    0x62: () => {
        cpu.BIT(4, cpu.D)
    },
    0x63: () => {
        cpu.BIT(4, cpu.E)
    },
    0x64: () => {
        cpu.BIT(4, cpu.H)
    },
    0x65: () => {
        cpu.BIT(4, cpu.L)
    },
    0x66: () => {
        cpu.BIT(4, mmu.read(cpu.HL()))
        cpu.clock.cycles += 8
    },
    0x67: () => {
        cpu.BIT(4, cpu.A)
    },
    0x68: () => {
        cpu.BIT(5, cpu.B)
    },
    0x69: () => {
        cpu.BIT(5, cpu.C)
    },
    0x6a: () => {
        cpu.BIT(5, cpu.D)
    },
    0x6b: () => {
        cpu.BIT(5, cpu.E)
    },
    0x6c: () => {
        cpu.BIT(5, cpu.H)
    },
    0x6d: () => {
        cpu.BIT(5, cpu.L)
    },
    0x6e: () => {
        cpu.BIT(5, mmu.read(cpu.HL()))
        cpu.clock.cycles += 8
    },
    0x6f: () => {
        cpu.BIT(5, cpu.A)
    },
    0x70: () => {
        cpu.BIT(6, cpu.B)
    },
    0x71: () => {
        cpu.BIT(6, cpu.C)
    },
    0x72: () => {
        cpu.BIT(6, cpu.D)
    },
    0x73: () => {
        cpu.BIT(6, cpu.E)
    },
    0x74: () => {
        cpu.BIT(6, cpu.H)
    },
    0x75: () => {
        cpu.BIT(6, cpu.L)
    },
    0x76: () => {
        cpu.BIT(6, mmu.read(cpu.HL()))
        cpu.clock.cycles += 8
    },
    0x77: () => {
        cpu.BIT(6, cpu.A)
    },
    0x78: () => {
        cpu.BIT(7, cpu.B)
    },
    0x79: () => {
        cpu.BIT(7, cpu.C)
    },
    0x7a: () => {
        cpu.BIT(7, cpu.D)
    },
    0x7b: () => {
        cpu.BIT(7, cpu.E)
    },
    0x7c: () => {
        cpu.BIT(7, cpu.H)
    },
    0x7d: () => {
        cpu.BIT(7, cpu.L)
    },
    0x7e: () => {
        cpu.BIT(7, mmu.read(cpu.HL()))
        cpu.clock.cycles += 8
    },
    0x7f: () => {
        cpu.BIT(7, cpu.A)
    },
    0x80: () => {
        cpu.RESR("B", 0)
    },
    0x81: () => {
        cpu.RESR("C", 0)
    },
    0x82: () => {
        cpu.RESR("D", 0)
    },
    0x83: () => {
        cpu.RESR("E", 0)
    },
    0x84: () => {
        cpu.RESR("H", 0)
    },
    0x85: () => {
        cpu.RESR("L", 0)
    },
    0x86: () => {
        cpu.RESM(0)
    },
    0x87: () => {
        cpu.RESR("A", 0)
    },
    0x88: () => {
        cpu.RESR("B", 1)
    },
    0x89: () => {
        cpu.RESR("C", 1)
    },
    0x8a: () => {
        cpu.RESR("D", 1)
    },
    0x8b: () => {
        cpu.RESR("E", 1)
    },
    0x8c: () => {
        cpu.RESR("H", 1)
    },
    0x8d: () => {
        cpu.RESR("L", 1)
    },
    0x8e: () => {
        cpu.RESM(1)
    },
    0x8f: () => {
        cpu.RESR("A", 1)
    },
    0x90: () => {
        cpu.RESR("B", 2)
    },
    0x91: () => {
        cpu.RESR("C", 2)
    },
    0x92: () => {
        cpu.RESR("D", 2)
    },
    0x93: () => {
        cpu.RESR("E", 2)
    },
    0x94: () => {
        cpu.RESR("H", 2)
    },
    0x95: () => {
        cpu.RESR("L", 2)
    },
    0x96: () => {
        cpu.RESM(2)
    },
    0x97: () => {
        cpu.RESR("A", 2)
    },
    0x98: () => {
        cpu.RESR("B", 3)
    },
    0x99: () => {
        cpu.RESR("C", 3)
    },
    0x9a: () => {
        cpu.RESR("D", 3)
    },
    0x9b: () => {
        cpu.RESR("E", 3)
    },
    0x9c: () => {
        cpu.RESR("H", 3)
    },
    0x9d: () => {
        cpu.RESR("L", 3)
    },
    0x9e: () => {
        cpu.RESM(3)
    },
    0x9f: () => {
        cpu.RESR("A", 3)
    },
    0xa0: () => {
        cpu.RESR("B", 4)
    },
    0xa1: () => {
        cpu.RESR("C", 4)
    },
    0xa2: () => {
        cpu.RESR("D", 4)
    },
    0xa3: () => {
        cpu.RESR("E", 4)
    },
    0xa4: () => {
        cpu.RESR("H", 4)
    },
    0xa5: () => {
        cpu.RESR("L", 4)
    },
    0xa6: () => {
        cpu.RESM(4)
    },
    0xa7: () => {
        cpu.RESR("A", 4)
    },
    0xa8: () => {
        cpu.RESR("B", 5)
    },
    0xa9: () => {
        cpu.RESR("C", 5)
    },
    0xaa: () => {
        cpu.RESR("D", 5)
    },
    0xab: () => {
        cpu.RESR("E", 5)
    },
    0xac: () => {
        cpu.RESR("H", 5)
    },
    0xad: () => {
        cpu.RESR("L", 5)
    },
    0xae: () => {
        cpu.RESM(5)
    },
    0xaf: () => {
        cpu.RESR("A", 5)
    },
    0xb0: () => {
        cpu.RESR("B", 6)
    },
    0xb1: () => {
        cpu.RESR("C", 6)
    },
    0xb2: () => {
        cpu.RESR("D", 6)
    },
    0xb3: () => {
        cpu.RESR("E", 6)
    },
    0xb4: () => {
        cpu.RESR("H", 6)
    },
    0xb5: () => {
        cpu.RESR("L", 6)
    },
    0xb6: () => {
        cpu.RESM(6)
    },
    0xb7: () => {
        cpu.RESR("A", 6)
    },
    0xb8: () => {
        cpu.RESR("B", 7)
    },
    0xb9: () => {
        cpu.RESR("C", 7)
    },
    0xba: () => {
        cpu.RESR("D", 7)
    },
    0xbb: () => {
        cpu.RESR("E", 7)
    },
    0xbc: () => {
        cpu.RESR("H", 7)
    },
    0xbd: () => {
        cpu.RESR("L", 7)
    },
    0xbe: () => {
        cpu.RESM(7)
    },
    0xbf: () => {
        cpu.RESR("A", 7)
    },
    0xc0: () => {
        cpu.SETR("B", 0)
    },
    0xc1: () => {
        cpu.SETR("C", 0)
    },
    0xc2: () => {
        cpu.SETR("D", 0)
    },
    0xc3: () => {
        cpu.SETR("E", 0)
    },
    0xc4: () => {
        cpu.SETR("H", 0)
    },
    0xc5: () => {
        cpu.SETR("L", 0)
    },
    0xc6: () => {
        cpu.SETM(0)
    },
    0xc7: () => {
        cpu.SETR("A", 0)
    },
    0xc8: () => {
        cpu.SETR("B", 1)
    },
    0xc9: () => {
        cpu.SETR("C", 1)
    },
    0xca: () => {
        cpu.SETR("D", 1)
    },
    0xcb: () => {
        cpu.SETR("E", 1)
    },
    0xcc: () => {
        cpu.SETR("H", 1)
    },
    0xcd: () => {
        cpu.SETR("L", 1)
    },
    0xce: () => {
        cpu.SETM(1)
    },
    0xcf: () => {
        cpu.SETR("A", 1)
    },
    0xd0: () => {
        cpu.SETR("B", 2)
    },
    0xd1: () => {
        cpu.SETR("C", 2)
    },
    0xd2: () => {
        cpu.SETR("D", 2)
    },
    0xd3: () => {
        cpu.SETR("E", 2)
    },
    0xd4: () => {
        cpu.SETR("H", 2)
    },
    0xd5: () => {
        cpu.SETR("L", 2)
    },
    0xd6: () => {
        cpu.SETM(2)
    },
    0xd7: () => {
        cpu.SETR("A", 2)
    },
    0xd8: () => {
        cpu.SETR("B", 3)
    },
    0xd9: () => {
        cpu.SETR("C", 2)
    },
    0xda: () => {
        cpu.SETR("D", 3)
    },
    0xdb: () => {
        cpu.SETR("E", 3)
    },
    0xdc: () => {
        cpu.SETR("H", 3)
    },
    0xdd: () => {
        cpu.SETR("L", 3)
    },
    0xde: () => {
        cpu.SETM(3)
    },
    0xdf: () => {
        cpu.SETR("A", 3)
    },
    0xe0: () => {
        cpu.SETR("B", 4)
    },
    0xe1: () => {
        cpu.SETR("C", 4)
    },
    0xe2: () => {
        cpu.SETR("D", 4)
    },
    0xe3: () => {
        cpu.SETR("E", 4)
    },
    0xe4: () => {
        cpu.SETR("H", 4)
    },
    0xe5: () => {
        cpu.SETR("L", 4)
    },
    0xe6: () => {
        cpu.SETM(4)
    },
    0xe7: () => {
        cpu.SETR("A", 4)
    },
    0xe8: () => {
        cpu.SETR("B", 5)
    },
    0xe9: () => {
        cpu.SETR("C", 5)
    },
    0xea: () => {
        cpu.SETR("D", 5)
    },
    0xeb: () => {
        cpu.SETR("E", 5)
    },
    0xec: () => {
        cpu.SETR("H", 5)
    },
    0xed: () => {
        cpu.SETR("L", 5)
    },
    0xee: () => {
        cpu.SETM(5)
    },
    0xef: () => {
        cpu.SETR("A", 5)
    },
    0xf0: () => {
        cpu.SETR("B", 6)
    },
    0xf1: () => {
        cpu.SETR("C", 6)
    },
    0xf2: () => {
        cpu.SETR("D", 6)
    },
    0xf3: () => {
        cpu.SETR("E", 6)
    },
    0xf4: () => {
        cpu.SETR("H", 6)
    },
    0xf5: () => {
        cpu.SETR("L", 6)
    },
    0xf6: () => {
        cpu.SETM(6)
    },
    0xf7: () => {
        cpu.SETR("A", 6)
    },
    0xf8: () => {
        cpu.SETR("B", 7)
    },
    0xf9: () => {
        cpu.SETR("C", 7)
    },
    0xfa: () => {
        cpu.SETR("D", 7)
    },
    0xfb: () => {
        cpu.SETR("E", 7)
    },
    0xfc: () => {
        cpu.SETR("H", 7)
    },
    0xfd: () => {
        cpu.SETR("L", 7)
    },
    0xfe: () => {
        cpu.SETM(7)
    },
    0xff: () => {
        cpu.SETR("A", 7)
    }
}

const prefix_cycles_lookup = [
    8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 8, 16, 8,
    8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 8, 16, 8,
    8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 8, 16, 8,
    8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 8, 16, 8,
    8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 8, 16, 8,
    8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 8, 16, 8,
    8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 8, 16, 8,
    8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 8, 16, 8,
    8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 8, 16, 8,
    8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 8, 16, 8,
    8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 8, 16, 8,
    8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 8, 16, 8,
    8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 8, 16, 8,
    8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 8, 16, 8,
    8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 8, 16, 8,
    8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 8, 16, 8,
    8, 8, 8, 8, 8, 8, 16, 8, 8, 8, 8, 8, 8, 8, 8, 16, 8
]

