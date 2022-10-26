"use strict"

const lookup = {
    0x00: () => {
        NOP()

    },
    0x01: () => {
    },
    0x02: () => {
    },
    0x03: () => {
    },
    0x04: () => {
        INCR8("B")

    },
    0x05: () => {
        DECR8("B")
    },
    0x06: () => {
        LDR("B", memory.read(cpu.PC + 1));
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
        LDR("A", memory.read(cpu.BC()))
        cpu.clock.cycles += 4
    },
    0x0b: () => {
    },
    0x0c: () => {
        INCR8("C")
    },
    0x0d: () => {
        DECR8("C")
    },
    0x0e: () => {
        LDR("C", memory.read(cpu.PC + 1));
        cpu.PC++
    },
    0x0f: () => {
    },
    0x10: () => {
    },
    0x11: () => {
    },
    0x12: () => {
        LDM(cpu.A, cpu.DE())
    },
    0x13: () => {
    },
    0x14: () => {
        INCR8("D")
    },
    0x15: () => {
        DECR8("D")
    },
    0x16: () => {
        LDR("D", memory.read(cpu.PC + 1));
        cpu.PC++
        cpu.clock.cycles += 4
    },
    0x17: () => {
    },
    0x18: () => {
        JR(memory.read(cpu.PC + 1))
    },
    0x19: () => {
    },
    0x1a: () => {
        LDR("A", memory.read(cpu.DE()))
        cpu.clock.cycles += 4
    },
    0x1b: () => {
    },
    0x1c: () => {
        INCR8("E")
    },
    0x1d: () => {
        DECR8("E")
    },
    0x1e: () => {
        LDR("E", memory.read(cpu.PC + 1));
        cpu.PC++
    },
    0x1f: () => {
    },
    0x20: () => {
        JRC(memory.read(cpu.PC + 1), cpu.Z === false)
    },
    0x21: () => {
    },
    0x22: () => {
        LDM(cpu.A, cpu.HL());
        cpu.setHL(cpu.HL() + 1)
    },
    0x23: () => {
    },
    0x24: () => {
        INCR8("H")
    },
    0x25: () => {
        DECR8("H")
    },
    0x26: () => {
        LDR("H", memory.read(cpu.PC + 1));
        cpu.PC++
        cpu.clock.cycles += 4
    },
    0x27: () => {
    },
    0x28: () => {
        JRC(memory.read(cpu.PC + 1), cpu.Z === true)
    },
    0x29: () => {
    },
    0x2a: () => {
        LDR("A", memory.read(cpu.HL()));
        cpu.setHL(cpu.HL() + 1)
        cpu.clock.cycles += 4
    },
    0x2b: () => {
    },
    0x2c: () => {
        INCR8("L")
    },
    0x2d: () => {
        DECR8("L")
    },
    0x2e: () => {
        LDR("L", memory.read(cpu.PC + 1));
        cpu.PC++
    },
    0x2f: () => {
    },
    0x30: () => {
        JRC(memory.read(cpu.PC + 1), cpu.Z === false)
    },
    0x31: () => {
    },
    0x32: () => {
        LDM(cpu.A, cpu.HL());
        cpu.setHL(cpu.HL() - 1)
    },
    0x33: () => {
    },
    0x34: () => {
    },
    0x35: () => {
    },
    0x36: () => {
        cpu.PC++
        LDM(memory.read(cpu.PC),cpu.HL())
        cpu.clock.cycles += 4
    },
    0x37: () => {
        SCF()
    },
    0x38: () => {
        JRC(memory.read(cpu.PC + 1), cpu.C === true)
    },
    0x39: () => {
    },
    0x3a: () => {
        LDR("A", memory.read(cpu.HL()));
        cpu.setHL(cpu.HL() - 1)
        cpu.clock.cycles += 4
    },
    0x3b: () => {
    },
    0x3c: () => {
        INCR8("A")
    },
    0x3d: () => {
        DECR8("A")
    },
    0x3e: () => {
        LDR("A", memory.read(cpu.PC + 1));
        cpu.PC++
    },
    0x3f: () => {
        CCF()
    },
    0x40: () => {
        LDR("B", cpu.B)
    },
    0x41: () => {
        LDR("B", cpu.C)
    },
    0x42: () => {
        LDR("B", cpu.D)
    },
    0x43: () => {
        LDR("B", cpu.E)
    },
    0x44: () => {
        LDR("B", cpu.H)
    },
    0x45: () => {
        LDR("B", cpu.L)
    },
    0x46: () => {
        LDR("B", memory.read(cpu.HL()))
    },
    0x47: () => {
        LDR("B", cpu.A)
    },
    0x48: () => {
        LDR("C", cpu.B)
    },
    0x49: () => {
        LDR("C", cpu.C)
    },
    0x4a: () => {
        LDR("C", cpu.D)
    },
    0x4b: () => {
        LDR("C", cpu.E)
    },
    0x4c: () => {
        LDR("C", cpu.H)
    },
    0x4d: () => {
        LDR("C", cpu.L)
    },
    0x4e: () => {
        LDR("C", memory.read(cpu.HL()))
    },
    0x4f: () => {
        LDR("C", cpu.A)
    },
    0x50: () => {
        LDR("D", cpu.B)
    },
    0x51: () => {
        LDR("D", cpu.C)
    },
    0x52: () => {
        LDR("D", cpu.D)
    },
    0x53: () => {
        LDR("D", cpu.E)
    },
    0x54: () => {
        LDR("D", cpu.H)
    },
    0x55: () => {
        LDR("D", cpu.L)
    },
    0x56: () => {
        LDR("D", memory.read(cpu.HL()))
    },
    0x57: () => {
        LDR("D", cpu.A)
    },
    0x58: () => {
        LDR("E", cpu.B)
    },
    0x59: () => {
        LDR("E", cpu.C)
    },
    0x5a: () => {
        LDR("E", cpu.D)
    },
    0x5b: () => {
        LDR("E", cpu.E)
    },
    0x5c: () => {
        LDR("E", cpu.H)
    },
    0x5d: () => {
        LDR("E", cpu.L)
    },
    0x5e: () => {
        LDR("E", memory.read(cpu.HL()))
    },
    0x5f: () => {
        LDR("D", cpu.A)
    },
    0x60: () => {
        LDR("H", cpu.B)
    },
    0x61: () => {
        LDR("H", cpu.C)
    },
    0x62: () => {
        LDR("H", cpu.D)
    },
    0x63: () => {
        LDR("H", cpu.E)
    },
    0x64: () => {
        LDR("H", cpu.H)
    },
    0x65: () => {
        LDR("H", cpu.L)
    },
    0x66: () => {
        LDR("H", memory.read(cpu.HL()))
    },
    0x67: () => {
        LDR("H", cpu.A)
    },
    0x68: () => {
        LDR("L", cpu.B)
    },
    0x69: () => {
        LDR("L", cpu.C)
    },
    0x6a: () => {
        LDR("L", cpu.D)
    },
    0x6b: () => {
        LDR("L", cpu.E)
    },
    0x6c: () => {
        LDR("L", cpu.H)
    },
    0x6d: () => {
        LDR("L", cpu.L)
    },
    0x6e: () => {
        LDR("L", memory.read(cpu.HL()))
    },
    0x6f: () => {
        LDR("L", cpu.A)
    },
    0x70: () => {
        LDM(cpu.B, memory.read(cpu.HL()))
    },
    0x71: () => {
        LDM(cpu.C, memory.read(cpu.HL()))
    },
    0x72: () => {
        LDM(cpu.D, memory.read(cpu.HL()))
    },
    0x73: () => {
        LDM(cpu.E, memory.read(cpu.HL()))
    },
    0x74: () => {
        LDM(cpu.H, memory.read(cpu.HL()))
    },
    0x75: () => {
        LDM(cpu.L, memory.read(cpu.HL()))
    },
    0x76: () => {
    },
    0x77: () => {
        LDM(cpu.A, memory.read(cpu.HL()))
    },
    0x78: () => {
        LDR("A", cpu.B)
    },
    0x79: () => {
        LDR("A", cpu.C)
    },
    0x7a: () => {
        LDR("A", cpu.D)
    },
    0x7b: () => {
        LDR("A", cpu.E)
    },
    0x7c: () => {
        LDR("A", cpu.H)
    },
    0x7d: () => {
        LDR("A", cpu.L)
    },
    0x7e: () => {
        LDR("A", memory.read(cpu.HL()))
    },
    0x7f: () => {
        LDR("A", cpu.A)
    },
    0x80: () => {
        ADDR("B")
    },
    0x81: () => {
        ADDR("C")
    },
    0x82: () => {
        ADDR("D")
    },
    0x83: () => {
        ADDR("E")
    },
    0x84: () => {
        ADDR("H")
    },
    0x85: () => {
        ADDR("L")
    },
    0x86: () => {
        ADDM(memory.read(cpu.HL()))
    },
    0x87: () => {
        ADDR("A")
    },
    0x88: () => {
        ADDCR("B")
    },
    0x89: () => {
        ADDCR("C")
    },
    0x8a: () => {
        ADDCR("D")
    },
    0x8b: () => {
        ADDCR("E")
    },
    0x8c: () => {
        ADDCR("H")
    },
    0x8d: () => {
        ADDCR("L")
    },
    0x8e: () => {
        ADDCM(memory.read(cpu.HL()))
    },
    0x8f: () => {
        ADDCR("A")
    },
    0x90: () => {
        SUBR("B")
    },
    0x91: () => {
        SUBR("C")
    },
    0x92: () => {
        SUBR("D")
    },
    0x93: () => {
        SUBR("E")
    },
    0x94: () => {
        SUBR("H")
    },
    0x95: () => {
        SUBR("L")
    },
    0x96: () => {
        SUBM(memory.read(cpu.HL()))
    },
    0x97: () => {
        SUBR("A")
    },
    0x98: () => {
        SBCR("B")
    },
    0x99: () => {
        SBCR("C")
    },
    0x9a: () => {
        SBCR("D")
    },
    0x9b: () => {
        SBCR("E")
    },
    0x9c: () => {
        SBCR("H")
    },
    0x9d: () => {
        SBCR("L")
    },
    0x9e: () => {
        SBCM(memory.read(cpu.HL()))
    },
    0x9f: () => {
        SBCR("A")
    },
    0xa0: () => {
        ANDR("B")
    },
    0xa1: () => {
        ANDR("C")
    },
    0xa2: () => {
        ANDR("D")
    },
    0xa3: () => {
        ANDR("E")
    },
    0xa4: () => {
        ANDR("H")
    },
    0xa5: () => {
        ANDR("L")
    },
    0xa6: () => {
        ANDM(memory.read(cpu.HL()))
    },
    0xa7: () => {
        ANDR("A")
    },
    0xa8: () => {
        XORR("B")
    },
    0xa9: () => {
        XORR("C")
    },
    0xaa: () => {
        XORR("D")
    },
    0xab: () => {
        XORR("E")
    },
    0xac: () => {
        XORR("H")
    },
    0xad: () => {
        XORR("L")
    },
    0xae: () => {
        XORM(memory.read(cpu.HL()))
    },
    0xaf: () => {
        XORR("A")
    },
    0xb0: () => {
        ORR("B")
    },
    0xb1: () => {
        ORR("C")
    },
    0xb2: () => {
        ORR("D")
    },
    0xb3: () => {
        ORR("E")
    },
    0xb4: () => {
        ORR("H")
    },
    0xb5: () => {
        ORR("L")
    },
    0xb6: () => {
        ORM(memory.read(cpu.HL()))
    },
    0xb7: () => {
        ORR("A")
    },
    0xb8: () => {
        CPR("B")
    },
    0xb9: () => {
        CPR("C")
    },
    0xba: () => {
        CPR("D")
    },
    0xbb: () => {
        CPR("E")
    },
    0xbc: () => {
        CPR("H")
    },
    0xbd: () => {
        CPR("L")
    },
    0xbe: () => {
        CPM(memory.read(cpu.HL()))
    },
    0xbf: () => {
        CPR("A")
    },
    0xc0: () => {
        RETC(cpu.Z === false)
    },
    0xc1: () => {
        POP("BC")
    },
    0xc2: () => {
        JPC(memory.read(cpu.PC + 1) << 8 | memory.read(cpu.PC + 2), cpu.Z === false)
    },
    0xc3: () => {
        JP(memory.read(cpu.PC + 1) << 8 | memory.read(cpu.PC + 2))
    },
    0xc4: () => {
        CALLC(memory.read(cpu.PC + 1) << 8 | memory.read(cpu.PC + 2), cpu.Z === false)
    },
    0xc5: () => {
        PUSH("BC")
    },
    0xc6: () => {
        ADDM(memory.read(cpu.PC + 1));
        cpu.PC++
    },
    0xc7: () => {
        RST(0x00)
    },
    0xc8: () => {
        RETC(cpu.Z === true)
    },
    0xc9: () => {
        RET()
    },
    0xca: () => {
        JPC(memory.read(cpu.PC + 1) << 8 | memory.read(cpu.PC + 2), cpu.Z === true)
    },
    0xcb: () => {
        console.warn("CB Prefix used in wrong lookup table!")
    },
    0xcc: () => {
        CALLC(memory.read(cpu.PC + 1) << 8 | memory.read(cpu.PC + 2), cpu.Z === true)
    },
    0xcd: () => {
        CALL(memory.read(cpu.PC + 1) << 8 | memory.PC + 2)
    },
    0xce: () => {
        ADDCM(memory.read(cpu.PC + 1));
        cpu.PC++
    },
    0xcf: () => {
        RST(0x08)
    },
    0xd0: () => {
        RETC(cpu.C === false)
    },
    0xd1: () => {
        POP("DE")
    },
    0xd2: () => {
        JPC(memory.read(cpu.PC + 1) << 8 | memory.read(cpu.PC + 2), cpu.C === false)
    },
    0xd3: () => {
        console.warn("Illegal Opcode!")
    },
    0xd4: () => {
        CALLC(memory.read(cpu.PC + 1) << 8 | memory.read(cpu.PC + 2), cpu.C === false)
    },
    0xd5: () => {
        PUSH("DE")
    },
    0xd6: () => {
        SUBM(memory.read(cpu.PC + 1));
        cpu.PC++
    },
    0xd7: () => {
        RST(0x10)
    },
    0xd8: () => {
        RETC(cpu.C === true)
    },
    0xd9: () => {
        RETI()
    },
    0xda: () => {
        JPC(memory.read(cpu.PC + 1) << 8 | memory.read(cpu.PC + 2), cpu.C === true)
    },
    0xdb: () => {
        console.warn("Illegal Opcode!")
    },
    0xdc: () => {
    },
    0xdd: () => {
        console.warn("Illegal Opcode!")
    },
    0xde: () => {
        SBCM(memory.read(cpu.PC + 1));
        cpu.PC++
    },
    0xdf: () => {
        RST(0x18)
    },
    0xe0: () => {
        LDM(cpu.A, (0xFF00 + memory.read(cpu.PC + 1)));
        cpu.PC++
    },
    0xe1: () => {
        POP("HL")
    },
    0xe2: () => {
        LDM(cpu.A, 0xFF00 + cpu.C)
    },
    0xe3: () => {
        console.warn("Illegal Opcode!")
    },
    0xe4: () => {
        console.warn("Illegal Opcode!")
    },
    0xe5: () => {
        PUSH("HL")
    },
    0xe6: () => {
        ANDM(memory.read(cpu.PC + 1));
        cpu.PC++
    },
    0xe7: () => {
        RST(0x20)
    },
    0xe8: () => {
    },
    0xe9: () => {
        JP(memory.read(cpu.PC + 1) << 8 | memory.read(cpu.PC + 2))
    },
    0xea: () => {
        LDM(cpu.A, memory.read(cpu.PC + 1) << 8 | memory.read(cpu.PC + 2));
        cpu.PC++
    },
    0xeb: () => {
        console.warn("Illegal Opcode!")
    },
    0xec: () => {
        console.warn("Illegal Opcode!")
    },
    0xed: () => {
        console.warn("Illegal Opcode!")
    },
    0xee: () => {
        XORM(memory.read(cpu.PC + 1));
        cpu.PC++
    },
    0xef: () => {
        RST(0x28)
    },
    0xf0: () => {
        LDR("A", memory.read(0xFF00 + memory.read(cpu.PC + 1)));
        cpu.PC++
    },
    0xf1: () => {
        POP("AF")
    },
    0xf2: () => {
        LDR("A", memory.read(0xFF00 + cpu.C))
    },
    0xf3: () => {
        DI()
    },
    0xf4: () => {
        console.warn("Illegal Opcode!")
    },
    0xf5: () => {
        PUSH("AF")
    },
    0xf6: () => {
        ORM(memory.read(cpu.PC + 1));
        cpu.PC++
    },
    0xf7: () => {
        RST(0x30)
    },
    0xf8: () => {
    },
    0xf9: () => {
    },
    0xfa: () => {
    },
    0xfb: () => {
        EI()
    },
    0xfc: () => {
        console.warn("Illegal Opcode!")
    },
    0xfd: () => {
        console.warn("Illegal Opcode!")
    },
    0xfe: () => {
        CPM(memory.read(cpu.PC + 1));
        cpu.PC++
    },
    0xff: () => {
        RST(0x38)
    }
}

// Prefix -> 0xCB -> next byte will indicate the instruction that should be executed
const prefix_lookup = {
    0x00: () => {
    },
    0x01: () => {
    },
    0x02: () => {
    },
    0x03: () => {
    },
    0x04: () => {
    },
    0x05: () => {
    },
    0x06: () => {
    },
    0x07: () => {
    },
    0x08: () => {
    },
    0x09: () => {
    },
    0x0a: () => {
    },
    0x0b: () => {
    },
    0x0c: () => {
    },
    0x0d: () => {
    },
    0x0e: () => {
    },
    0x0f: () => {
    },
    0x10: () => {
    },
    0x11: () => {
    },
    0x12: () => {
    },
    0x13: () => {
    },
    0x14: () => {
    },
    0x15: () => {
    },
    0x16: () => {
    },
    0x17: () => {
    },
    0x18: () => {
    },
    0x19: () => {
    },
    0x1a: () => {
    },
    0x1b: () => {
    },
    0x1c: () => {
    },
    0x1d: () => {
    },
    0x1e: () => {
    },
    0x1f: () => {
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
    },
    0x31: () => {
    },
    0x32: () => {
    },
    0x33: () => {
    },
    0x34: () => {
    },
    0x35: () => {
    },
    0x36: () => {
    },
    0x37: () => {
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
        BIT(0, cpu.B)
        return 8
    },
    0x41: () => {
        BIT(0, cpu.C)
    },
    0x42: () => {
        BIT(0, cpu.D)
    },
    0x43: () => {
        BIT(0, cpu.E)
    },
    0x44: () => {
        BIT(0, cpu.H)
    },
    0x45: () => {
        BIT(0, cpu.L)
    },
    0x46: () => {
        BIT(0, memory.read(cpu.HL()))
        cpu.clock.cycles += 8
    },
    0x47: () => {
        BIT(0, cpu.A)
    },
    0x48: () => {
        BIT(1, cpu.B)
    },
    0x49: () => {
        BIT(1, cpu.C)
    },
    0x4a: () => {
        BIT(1, cpu.D)
    },
    0x4b: () => {
        BIT(1, cpu.E)
    },
    0x4c: () => {
        BIT(1, cpu.H)
    },
    0x4d: () => {
        BIT(1, cpu.L)
    },
    0x4e: () => {
        BIT(1, memory.read(cpu.HL()))
        cpu.clock.cycles += 8
    },
    0x4f: () => {
        BIT(1, cpu.A)
    },
    0x50: () => {
        BIT(2, cpu.B)
    },
    0x51: () => {
        BIT(2, cpu.C)
    },
    0x52: () => {
        BIT(2, cpu.D)
    },
    0x53: () => {
        BIT(2, cpu.E)
    },
    0x54: () => {
        BIT(2, cpu.H)
    },
    0x55: () => {
        BIT(2, cpu.L)
    },
    0x56: () => {
        BIT(2, memory.read(cpu.HL()))
        cpu.clock.cycles += 8
    },
    0x57: () => {
        BIT(2, cpu.A)
    },
    0x58: () => {
        BIT(3, cpu.B)
    },
    0x59: () => {
        BIT(3, cpu.C)
    },
    0x5a: () => {
        BIT(3, cpu.D)
    },
    0x5b: () => {
        BIT(3, cpu.E)
    },
    0x5c: () => {
        BIT(3, cpu.H)
    },
    0x5d: () => {
        BIT(3, cpu.L)
    },
    0x5e: () => {
        BIT(3, memory.read(cpu.HL()))
        cpu.clock.cycles += 8
    },
    0x5f: () => {
        BIT(3, cpu.A)
    },
    0x60: () => {
        BIT(4, cpu.B)
    },
    0x61: () => {
        BIT(4, cpu.C)
    },
    0x62: () => {
        BIT(4, cpu.D)
    },
    0x63: () => {
        BIT(4, cpu.E)
    },
    0x64: () => {
        BIT(4, cpu.H)
    },
    0x65: () => {
        BIT(4, cpu.L)
    },
    0x66: () => {
        BIT(4, memory.read(cpu.HL()))
        cpu.clock.cycles += 8
    },
    0x67: () => {
        BIT(4, cpu.A)
    },
    0x68: () => {
        BIT(5, cpu.B)
    },
    0x69: () => {
        BIT(5, cpu.C)
    },
    0x6a: () => {
        BIT(5, cpu.D)
    },
    0x6b: () => {
        BIT(5, cpu.E)
    },
    0x6c: () => {
        BIT(5, cpu.H)
    },
    0x6d: () => {
        BIT(5, cpu.L)
    },
    0x6e: () => {
        BIT(5, memory.read(cpu.HL()))
        cpu.clock.cycles += 8
    },
    0x6f: () => {
        BIT(5, cpu.A)
    },
    0x70: () => {
        BIT(6, cpu.B)
    },
    0x71: () => {
        BIT(6, cpu.C)
    },
    0x72: () => {
        BIT(6, cpu.D)
    },
    0x73: () => {
        BIT(6, cpu.E)
    },
    0x74: () => {
        BIT(6, cpu.H)
    },
    0x75: () => {
        BIT(6, cpu.L)
    },
    0x76: () => {
        BIT(6, memory.read(cpu.HL()))
        cpu.clock.cycles += 8
    },
    0x77: () => {
        BIT(6, cpu.A)
    },
    0x78: () => {
        BIT(7, cpu.B)
    },
    0x79: () => {
        BIT(7, cpu.C)
    },
    0x7a: () => {
        BIT(7, cpu.D)
    },
    0x7b: () => {
        BIT(7, cpu.E)
    },
    0x7c: () => {
        BIT(7, cpu.H)
    },
    0x7d: () => {
        BIT(7, cpu.L)
    },
    0x7e: () => {
        BIT(7, memory.read(cpu.HL()))
        cpu.clock.cycles += 8
    },
    0x7f: () => {
        BIT(7, cpu.A)
    },
    0x80: () => {
        RESR("B",0)
    },
    0x81: () => {
        RESR("C",0)
    },
    0x82: () => {
        RESR("D",0)
    },
    0x83: () => {
        RESR("E",0)
    },
    0x84: () => {
        RESR("H",0)
    },
    0x85: () => {
        RESR("L",0)
    },
    0x86: () => {
        RESM(0)
    },
    0x87: () => {
        RESR("A",0)
    },
    0x88: () => {
        RESR("B",1)
    },
    0x89: () => {
        RESR("C",1)
    },
    0x8a: () => {
        RESR("D",1)
    },
    0x8b: () => {
        RESR("E",1)
    },
    0x8c: () => {
        RESR("H",1)
    },
    0x8d: () => {
        RESR("L",1)
    },
    0x8e: () => {
        RESM(1)
    },
    0x8f: () => {
        RESR("A",1)
    },
    0x90: () => {
        RESR("B",2)
    },
    0x91: () => {
        RESR("C",2)
    },
    0x92: () => {
        RESR("D",2)
    },
    0x93: () => {
        RESR("E",2)
    },
    0x94: () => {
        RESR("H",2)
    },
    0x95: () => {
        RESR("L",2)
    },
    0x96: () => {
        RESM(2)
    },
    0x97: () => {
        RESR("A",2)
    },
    0x98: () => {
        RESR("B",3)
    },
    0x99: () => {
        RESR("C",3)
    },
    0x9a: () => {
        RESR("D",3)
    },
    0x9b: () => {
        RESR("E",3)
    },
    0x9c: () => {
        RESR("H",3)
    },
    0x9d: () => {
        RESR("L",3)
    },
    0x9e: () => {
        RESM(3)
    },
    0x9f: () => {
        RESR("A",3)
    },
    0xa0: () => {
        RESR("B",4)
    },
    0xa1: () => {
        RESR("C",4)
    },
    0xa2: () => {
        RESR("D",4)
    },
    0xa3: () => {
        RESR("E",4)
    },
    0xa4: () => {
        RESR("H",4)
    },
    0xa5: () => {
        RESR("L",4)
    },
    0xa6: () => {
        RESM(4)
    },
    0xa7: () => {
        RESR("A",4)
    },
    0xa8: () => {
        RESR("B",5)
    },
    0xa9: () => {
        RESR("C",5)
    },
    0xaa: () => {
        RESR("D",5)
    },
    0xab: () => {
        RESR("E",5)
    },
    0xac: () => {
        RESR("H",5)
    },
    0xad: () => {
        RESR("L",5)
    },
    0xae: () => {
        RESM(5)
    },
    0xaf: () => {
        RESR("A",5)
    },
    0xb0: () => {
        RESR("B",6)
    },
    0xb1: () => {
        RESR("C",6)
    },
    0xb2: () => {
        RESR("D",6)
    },
    0xb3: () => {
        RESR("E",6)
    },
    0xb4: () => {
        RESR("H",6)
    },
    0xb5: () => {
        RESR("L",6)
    },
    0xb6: () => {
        RESM(6)
    },
    0xb7: () => {
        RESR("A",6)
    },
    0xb8: () => {
        RESR("B",7)
    },
    0xb9: () => {
        RESR("C",7)
    },
    0xba: () => {
        RESR("D",7)
    },
    0xbb: () => {
        RESR("E",7)
    },
    0xbc: () => {
        RESR("H",7)
    },
    0xbd: () => {
        RESR("L",7)
    },
    0xbe: () => {
        RESM(7)
    },
    0xbf: () => {
        RESR("A",7)
    },
    0xc0: () => {
        SETR("B",0)
    },
    0xc1: () => {
        SETR("C",0)
    },
    0xc2: () => {
        SETR("D",0)
    },
    0xc3: () => {
        SETR("E",0)
    },
    0xc4: () => {
        SETR("H",0)
    },
    0xc5: () => {
        SETR("L",0)
    },
    0xc6: () => {
        SETM(0)
    },
    0xc7: () => {
        SETR("A",0)
    },
    0xc8: () => {
        SETR("B",1)
    },
    0xc9: () => {
        SETR("C",1)
    },
    0xca: () => {
        SETR("D",1)
    },
    0xcb: () => {
        SETR("E",1)
    },
    0xcc: () => {
        SETR("H",1)
    },
    0xcd: () => {
        SETR("L",1)
    },
    0xce: () => {
        SETM(1)
    },
    0xcf: () => {
        SETR("A",1)
    },
    0xd0: () => {
        SETR("B",2)
    },
    0xd1: () => {
        SETR("C",2)
    },
    0xd2: () => {
        SETR("D",2)
    },
    0xd3: () => {
        SETR("E",2)
    },
    0xd4: () => {
        SETR("H",2)
    },
    0xd5: () => {
        SETR("L",2)
    },
    0xd6: () => {
        SETM(2)
    },
    0xd7: () => {
        SETR("A",2)
    },
    0xd8: () => {
        SETR("B",3)
    },
    0xd9: () => {
        SETR("C",2)
    },
    0xda: () => {
        SETR("D",3)
    },
    0xdb: () => {
        SETR("E",3)
    },
    0xdc: () => {
        SETR("H",3)
    },
    0xdd: () => {
        SETR("L",3)
    },
    0xde: () => {
        SETM(3)
    },
    0xdf: () => {
        SETR("A",3)
    },
    0xe0: () => {
        SETR("B",4)
    },
    0xe1: () => {
        SETR("C",4)
    },
    0xe2: () => {
        SETR("D",4)
    },
    0xe3: () => {
        SETR("E",4)
    },
    0xe4: () => {
        SETR("H",4)
    },
    0xe5: () => {
        SETR("L",4)
    },
    0xe6: () => {
        SETM(4)
    },
    0xe7: () => {
        SETR("A",4)
    },
    0xe8: () => {
        SETR("B",5)
    },
    0xe9: () => {
        SETR("C",5)
    },
    0xea: () => {
        SETR("D",5)
    },
    0xeb: () => {
        SETR("E",5)
    },
    0xec: () => {
        SETR("H",5)
    },
    0xed: () => {
        SETR("L",5)
    },
    0xee: () => {
        SETM(5)
    },
    0xef: () => {
        SETR("A",5)
    },
    0xf0: () => {
        SETR("B",6)
    },
    0xf1: () => {
        SETR("C",6)
    },
    0xf2: () => {
        SETR("D",6)
    },
    0xf3: () => {
        SETR("E",6)
    },
    0xf4: () => {
        SETR("H",6)
    },
    0xf5: () => {
        SETR("L",6)
    },
    0xf6: () => {
        SETM(6)
    },
    0xf7: () => {
        SETR("A",6)
    },
    0xf8: () => {
        SETR("B",7)
    },
    0xf9: () => {
        SETR("C",7)
    },
    0xfa: () => {
        SETR("D",7)
    },
    0xfb: () => {
        SETR("E",7)
    },
    0xfc: () => {
        SETR("H",7)
    },
    0xfd: () => {
        SETR("L",7)
    },
    0xfe: () => {
        SETM(7)
    },
    0xff: () => {
        SETR("A",7)
    }
}

const prefix_cycles_lookup = [
    8,8,8,8,8,8,16,8,8,8,8,8,8,8,8,16,8,
    8,8,8,8,8,8,16,8,8,8,8,8,8,8,8,16,8,
    8,8,8,8,8,8,16,8,8,8,8,8,8,8,8,16,8,
    8,8,8,8,8,8,16,8,8,8,8,8,8,8,8,16,8,
    8,8,8,8,8,8,16,8,8,8,8,8,8,8,8,16,8,
    8,8,8,8,8,8,16,8,8,8,8,8,8,8,8,16,8,
    8,8,8,8,8,8,16,8,8,8,8,8,8,8,8,16,8,
    8,8,8,8,8,8,16,8,8,8,8,8,8,8,8,16,8,
    8,8,8,8,8,8,16,8,8,8,8,8,8,8,8,16,8,
    8,8,8,8,8,8,16,8,8,8,8,8,8,8,8,16,8,
    8,8,8,8,8,8,16,8,8,8,8,8,8,8,8,16,8,
    8,8,8,8,8,8,16,8,8,8,8,8,8,8,8,16,8,
    8,8,8,8,8,8,16,8,8,8,8,8,8,8,8,16,8,
    8,8,8,8,8,8,16,8,8,8,8,8,8,8,8,16,8,
    8,8,8,8,8,8,16,8,8,8,8,8,8,8,8,16,8,
    8,8,8,8,8,8,16,8,8,8,8,8,8,8,8,16,8,
    8,8,8,8,8,8,16,8,8,8,8,8,8,8,8,16,8
]

