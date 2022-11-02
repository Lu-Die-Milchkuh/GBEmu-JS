"use strict"

import {cpu} from "./cpu.js"
import {mmu} from "./mmu.js"

export const lookup = {
    0x00: () => {
        cpu.NOP()

    },
    0x01: () => {
        cpu.PC++
        let highByte = mmu.read(cpu.PC)
        cpu.PC++
        let lowByte = mmu.read(cpu.PC)
        cpu.LDR16("BC", highByte << 8 | lowByte)

    },
    0x02: () => {
        cpu.LDM16(cpu.BC(), cpu.A)
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
        cpu.LDR("B", mmu.read(cpu.PC + 1));
        cpu.PC++
        cpu.clock.cycles += 4
    },
    0x07: () => {
    },
    0x08: () => {
    },
    0x09: () => {
    },
    0x0a: () => {
        cpu.LDR("A", mmu.read(cpu.BC()))
        cpu.clock.cycles += 4
    },
    0x0b: () => {
        cpu.DECR16("BC")
    },
    0x0c: () => {
        cpu.INCR8("C")
    },
    0x0d: () => {
        //console.log(`C contains ${cpu.C}`)
        cpu.DECR8("C")
        //console.log(`${mmu.read(0x219)} ${mmu.read(0x21A)} ${mmu.read(0x21B)}`)
        //console.log(cpu.flags.Z)
    },
    0x0e: () => {
        cpu.PC++
        let byte = mmu.read(cpu.PC)
        cpu.LDR("C", byte)
    },
    0x0f: () => {
    },
    0x10: () => {
        cpu.STOP()
    },
    0x11: () => {
        let highByte = mmu.read(cpu.PC + 1)
        let lowByte = mmu.read(cpu.PC + 2)
        cpu.LDR16("DE", highByte << 8 | lowByte)
        cpu.PC += 2
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
        cpu.LDR("D", mmu.read(cpu.PC + 1));
        cpu.PC++
        cpu.clock.cycles += 4
    },
    0x17: () => {
    },
    0x18: () => {
        cpu.JR(mmu.read(cpu.PC + 1))
    },
    0x19: () => {
    },
    0x1a: () => {
        cpu.LDR("A", mmu.read(cpu.DE()))
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
        cpu.LDR("E", mmu.read(cpu.PC + 1));
        cpu.PC++
    },
    0x1f: () => {
        cpu.RRA()
    },
    0x20: () => {
        cpu.PC++
        let offset = mmu.read(cpu.PC)
        //console.log(`Condition ${cpu.flags.Z === false}, ${cpu.flags.Z},Offset: ${offset}`)
        cpu.JRC(offset, cpu.flags.Z === false)
    },
    0x21: () => {
        cpu.PC++
        let highByte = mmu.read(cpu.PC)
        cpu.PC++
        let lowByte = mmu.read(cpu.PC)
        let data = lowByte << 8 | highByte
        cpu.LDR16("HL", data)
    },
    0x22: () => {
        cpu.LDM(cpu.A, cpu.HL())
        let newHL = cpu.HL() + 1
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
        cpu.LDR("H", mmu.read(cpu.PC + 1));
        cpu.PC++
        cpu.clock.cycles += 4
    },
    0x27: () => {
    },
    0x28: () => {
        cpu.JRC(mmu.read(cpu.PC + 1), cpu.flags.Z === true)
    },
    0x29: () => {
    },
    0x2a: () => {
        cpu.LDR("A", mmu.read(cpu.HL()))
        let newHL = cpu.HL() + 1
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
        cpu.LDR("L", mmu.read(cpu.PC + 1));
        cpu.PC++
    },
    0x2f: () => {
        cpu.CPL()
    },
    0x30: () => {
        cpu.JRC(mmu.read(cpu.PC + 1), cpu.flags.Z === false)
    },
    0x31: () => {
        cpu.PC++
        let lowByte = mmu.read(cpu.PC)
        cpu.PC++
        let highByte = mmu.read(cpu.PC)
        cpu.LDR16("SP", lowByte << 8 | highByte)
    },
    0x32: () => {
        cpu.LDM(cpu.A, cpu.HL())
        let newHL = (cpu.HL() - 1) % 0x10000
        cpu.setHL(newHL)
    },
    0x33: () => {
    },
    0x34: () => {
    },
    0x35: () => {
    },
    0x36: () => {
        cpu.PC++
        cpu.LDM(mmu.read(cpu.PC), cpu.HL())
        cpu.clock.cycles += 4
    },
    0x37: () => {
        cpu.SCF()
    },
    0x38: () => {
        cpu.JRC(mmu.read(cpu.PC + 1), cpu.flags.C === true)
    },
    0x39: () => {
    },
    0x3a: () => {
        cpu.LDR("A", mmu.read(cpu.HL()))
        let newHL = cpu.HL() + 1
        cpu.setHL(newHL)
        cpu.clock.cycles += 4
    },
    0x3b: () => {
        cpu.DECR16("SP")
    },
    0x3c: () => {
        cpu.INCR8("A")
    },
    0x3d: () => {
        cpu.DECR8("A")
    },
    0x3e: () => {
        cpu.PC++
        cpu.LDR("A", mmu.read(cpu.PC));
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
        cpu.LDR("B", mmu.read(cpu.HL()))
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
        cpu.LDR("C", mmu.read(cpu.HL()))
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
        cpu.LDR("D", mmu.read(cpu.HL()))
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
        cpu.LDR("E", mmu.read(cpu.HL()))
    },
    0x5f: () => {
        cpu.LDR("D", cpu.A)
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
        cpu.LDR("H", mmu.read(cpu.HL()))
    },
    0x67: () => {
        cpu.LDR("H", cpu.A)
    },
    0x68: () => {
        cpu.LDR("L", cpu.B)
    },
    0x69: () => {
        LDR("L", cpu.C)
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
        cpu.LDR("L", mmu.read(cpu.HL()))
    },
    0x6f: () => {
        cpu.LDR("L", cpu.A)
    },
    0x70: () => {
        cpu.LDM(cpu.B, mmu.read(cpu.HL()))
    },
    0x71: () => {
        cpu.LDM(cpu.C, mmu.read(cpu.HL()))
    },
    0x72: () => {
        cpu.LDM(cpu.D, mmu.read(cpu.HL()))
    },
    0x73: () => {
        cpu.LDM(cpu.E, mmu.read(cpu.HL()))
    },
    0x74: () => {
        cpu.LDM(cpu.H, mmu.read(cpu.HL()))
    },
    0x75: () => {
        cpu.LDM(cpu.L, mmu.read(cpu.HL()))
    },
    0x76: () => {
    },
    0x77: () => {
        cpu.LDM(cpu.A, mmu.read(cpu.HL()))
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
        cpu.LDR("A", mmu.read(cpu.HL()))
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
        cpu.XORM(mmu.read(cpu.HL()))
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
        cpu.CPM(mmu.read(cpu.HL()))
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
        cpu.PC++
        let highByte = mmu.read(cpu.PC)
        cpu.PC++
        let lowByte = mmu.read(cpu.PC)
        cpu.JPC(lowByte << 8 | highByte, cpu.flags.Z === false)
    },
    0xc3: () => {
        cpu.PC++
        let highByte = mmu.read(cpu.PC)
        cpu.PC++
        let lowByte = mmu.read(cpu.PC)
        cpu.JP(lowByte << 8 | highByte)
    },
    0xc4: () => {
        cpu.PC++
        let highByte = mmu.read(cpu.PC)
        cpu.PC++
        let lowByte = mmu.read(cpu.PC)
        cpu.CALLC(lowByte << 8 | highByte, cpu.flags.Z === false)
    },
    0xc5: () => {
        cpu.PUSH("BC")
    },
    0xc6: () => {
        cpu.ADDM(mmu.read(cpu.PC + 1));
        cpu.PC++
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
        cpu.PC++
        let highByte = mmu.read(cpu.PC)
        cpu.PC++
        let lowByte = mmu.read(cpu.PC)
        cpu.JPC(lowByte << 8 | highByte, cpu.flags.Z === true)
    },
    0xcb: () => {
        console.error("CB Prefix used in wrong lookup table!")
    },
    0xcc: () => {
        cpu.PC++
        let highByte = mmu.read(cpu.PC)
        cpu.PC++
        let lowByte = mmu.read(cpu.PC)
        cpu.CALLC(lowByte << 8 | highByte, cpu.flags.Z === true)
    },
    0xcd: () => {
        cpu.PC++
        let highByte = mmu.read(cpu.PC)
        cpu.PC++
        let lowByte = mmu.read(cpu.PC)
        cpu.CALL(lowByte << 8 | highByte)
    },
    0xce: () => {
        cpu.ADDCM(mmu.read(cpu.PC + 1));
        cpu.PC++
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
        cpu.PC++
        let highByte = mmu.read(cpu.PC)
        cpu.PC++
        let lowByte = mmu.read(cpu.PC)
        cpu.JPC(lowByte << 8 | highByte, cpu.flags.C === false)
    },
    0xd3: () => {
        console.error("Illegal Opcode!")
    },
    0xd4: () => {
        cpu.PC++
        let highByte = mmu.read(cpu.PC)
        cpu.PC++
        let lowByte = mmu.read(cpu.PC)
        cpu.CALLC(lowByte << 8 | highByte, cpu.flags.C === false)
    },
    0xd5: () => {
        cpu.PUSH("DE")
    },
    0xd6: () => {
        cpu.SUBM(mmu.read(cpu.PC + 1));
        cpu.PC++
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
        cpu.PC++
        let highByte = mmu.read(cpu.PC)
        cpu.PC++
        let lowByte = mmu.read(cpu.PC)
        cpu.JPC(lowByte << 8 | highByte, cpu.flags.C === true)
    },
    0xdb: () => {
        console.error("Illegal Opcode!")
    },
    0xdc: () => {
        cpu.PC++
        let lowByte = mmu.read(cpu.PC)
        cpu.PC++
        let highByte = mmu.read(cpu.PC)
        cpu.CALLC(lowByte << 8 | highByte, cpu.flags.C === true)
    },
    0xdd: () => {
        console.error("Illegal Opcode!")
    },
    0xde: () => {
        cpu.SBCM(mmu.read(cpu.PC + 1));
        cpu.PC++
    },
    0xdf: () => {
        cpu.RST(0x18)
    },
    0xe0: () => {
        cpu.PC++
        let offset = mmu.read(cpu.PC)
        cpu.LDM(cpu.A, (0xFF00 + offset))
        //cpu.PC++
        cpu.clock.cycles += 4
    },
    0xe1: () => {
        cpu.POP("HL")
    },
    0xe2: () => {
        cpu.LDM(cpu.A, 0xFF00 + cpu.C)
    },
    0xe3: () => {
        console.error("Illegal Opcode!")
    },
    0xe4: () => {
        console.error("Illegal Opcode!")
    },
    0xe5: () => {
        cpu.PUSH("HL")
    },
    0xe6: () => {
        cpu.ANDM(mmu.read(cpu.PC + 1));
        cpu.PC++
    },
    0xe7: () => {
        RST(0x20)
    },
    0xe8: () => {
    },
    0xe9: () => {
        cpu.PC++
        let highByte = mmu.read(cpu.PC)
        cpu.PC++
        let lowByte = mmu.read(cpu.PC)
        cpu.JP(lowByte << 8 | highByte)
    },
    0xea: () => {
        cpu.PC++
        let highByte = mmu.read(cpu.PC)
        cpu.PC++
        let lowByte = mmu.read(cpu.PC)
        cpu.LDM(cpu.A, lowByte << 8 | highByte);
        cpu.PC++
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
        cpu.XORM(mmu.read(cpu.PC + 1));
        cpu.PC++
    },
    0xef: () => {
        cpu.RST(0x28)
    },
    0xf0: () => {
        cpu.PC++
        let byte = mmu.read(cpu.PC)
        cpu.LDR("A", mmu.read(0xFF00 + byte))
        //console.error(`OP 0xF0 Address ${(0xFF00 + byte).toString(16)}: ${mmu.read(0xFF44)}`)

    },
    0xf1: () => {
        cpu.POP("AF")
    },
    0xf2: () => {
        cpu.LDR("A", mmu.read(0xFF00 + cpu.C))
    },
    0xf3: () => {
        cpu.DI()
    },
    0xf4: () => {
        console.error("Illegal Opcode!")
    },
    0xf5: () => {
        cpu.PUSH("AF")
    },
    0xf6: () => {
        cpu.ORM(mmu.read(cpu.PC + 1));
        cpu.PC++
    },
    0xf7: () => {
        cpu.RST(0x30)
    },
    0xf8: () => {
    },
    0xf9: () => {
    },
    0xfa: () => {
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
        cpu.PC++
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

