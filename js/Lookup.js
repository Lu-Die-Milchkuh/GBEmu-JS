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
    },
    0x07: () => {
    },
    0x08: () => {
    },
    0x09: () => {
    },
    0x0a: () => {
        LDR("A", memory.read(cpu.BC()))
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
    },
    0x7f: () => {
        BIT(7, cpu.A)
    },
    0x80: () => {
    },
    0x81: () => {
    },
    0x82: () => {
    },
    0x83: () => {
    },
    0x84: () => {
    },
    0x85: () => {
    },
    0x86: () => {
    },
    0x87: () => {
    },
    0x88: () => {
    },
    0x89: () => {
    },
    0x8a: () => {
    },
    0x8b: () => {
    },
    0x8c: () => {
    },
    0x8d: () => {
    },
    0x8e: () => {
    },
    0x8f: () => {
    },
    0x90: () => {
    },
    0x91: () => {
    },
    0x92: () => {
    },
    0x93: () => {
    },
    0x94: () => {
    },
    0x95: () => {
    },
    0x96: () => {
    },
    0x97: () => {
    },
    0x98: () => {
    },
    0x99: () => {
    },
    0x9a: () => {
    },
    0x9b: () => {
    },
    0x9c: () => {
    },
    0x9d: () => {
    },
    0x9e: () => {
    },
    0x9f: () => {
    },
    0xa0: () => {
    },
    0xa1: () => {
    },
    0xa2: () => {
    },
    0xa3: () => {
    },
    0xa4: () => {
    },
    0xa5: () => {
    },
    0xa6: () => {
    },
    0xa7: () => {
    },
    0xa8: () => {
    },
    0xa9: () => {
    },
    0xaa: () => {
    },
    0xab: () => {
    },
    0xac: () => {
    },
    0xad: () => {
    },
    0xae: () => {
    },
    0xaf: () => {
    },
    0xb0: () => {
    },
    0xb1: () => {
    },
    0xb2: () => {
    },
    0xb3: () => {
    },
    0xb4: () => {
    },
    0xb5: () => {
    },
    0xb6: () => {
    },
    0xb7: () => {
    },
    0xb8: () => {
    },
    0xb9: () => {
    },
    0xba: () => {
    },
    0xbb: () => {
    },
    0xbc: () => {
    },
    0xbd: () => {
    },
    0xbe: () => {
    },
    0xbf: () => {
    },
    0xc0: () => {
    },
    0xc1: () => {
    },
    0xc2: () => {
    },
    0xc3: () => {
    },
    0xc4: () => {
    },
    0xc5: () => {
    },
    0xc6: () => {
    },
    0xc7: () => {
    },
    0xc8: () => {
    },
    0xc9: () => {
    },
    0xca: () => {
    },
    0xcb: () => {
    },
    0xcc: () => {
    },
    0xcd: () => {
    },
    0xce: () => {
    },
    0xcf: () => {
    },
    0xd0: () => {
    },
    0xd1: () => {
    },
    0xd2: () => {
    },
    0xd3: () => {
    },
    0xd4: () => {
    },
    0xd5: () => {
    },
    0xd6: () => {
    },
    0xd7: () => {
    },
    0xd8: () => {
    },
    0xd9: () => {
    },
    0xda: () => {
    },
    0xdb: () => {
    },
    0xdc: () => {
    },
    0xdd: () => {
    },
    0xde: () => {
    },
    0xdf: () => {
    },
    0xe0: () => {
    },
    0xe1: () => {
    },
    0xe2: () => {
    },
    0xe3: () => {
    },
    0xe4: () => {
    },
    0xe5: () => {
    },
    0xe6: () => {
    },
    0xe7: () => {
    },
    0xe8: () => {
    },
    0xe9: () => {
    },
    0xea: () => {
    },
    0xeb: () => {
    },
    0xec: () => {
    },
    0xed: () => {
    },
    0xee: () => {
    },
    0xef: () => {
    },
    0xf0: () => {
    },
    0xf1: () => {
    },
    0xf2: () => {
    },
    0xf3: () => {
    },
    0xf4: () => {
    },
    0xf5: () => {
    },
    0xf6: () => {
    },
    0xf7: () => {
    },
    0xf8: () => {
    },
    0xf9: () => {
    },
    0xfa: () => {
    },
    0xfb: () => {
    },
    0xfc: () => {
    },
    0xfd: () => {
    },
    0xfe: () => {
    },
    0xff: () => {
    }
}