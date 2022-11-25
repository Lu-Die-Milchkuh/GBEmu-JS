# GBEmu-JS

## About

A Game Boy Emulator written in Javascript

## Todo

- [ ] Pass all of Blarrg's test ROMs
- [ ] Rendering
- [ ] Audio
- [ ] Keyboard Input
- [ ] Controller Input
- [ ] Code Optimization
- [ ] WASM backend (Idea)
- [ ] Debugger

## Achievements

| ROM                   | Status   | 
|-----------------------|----------|
| 01-special            | PASS     |
| 02-interrupts         | Fails    |
| 03-op sp,hl           | Fails    |
| 04-op r,imm           | PASS     |
| 05-op rp              | PASS     |
| 06-ld r,r             | PASS     |
| 07-jr,jp,call,ret,rst | PASS     |
| 08-misc instrs        | PASS     |
| 09-op r,r             | PASS     |
| 10-bit ops            | PASS     |
| 11-op a,(hl)          | Fails    |
| cpu_instrs            | untested |

- PASS -> ROM outputs "Passed" status
- Fails -> ROM outputs "Failed" status
- Unknown -> Emulator can not reach ROM evaluation

## Credits

- Documentation
    - [Game Boy Pandocs](https://gbdev.io/pandocs/)
    - [Gbops - Opcode Table](https://izik1.github.io/gbops/)


- Reference Emulator
    - [Gameboy-Crust by mattbruv](https://github.com/mattbruv/Gameboy-Crust)
    - [gameboy.js by juichi](https://github.com/juchi/gameboy.js/)

Special thanks to the guys at [r/EmuDev](https://www.reddit.com/r/EmuDev/) for helping through my journey!