# GBEmu-JS

## About
A Game Boy Emulator written in Javascript

## Todo
- [ ] Pass all of Blarrg's test ROMs
- [ ] Rendering
- [ ] Audio
- [ ] Keyboard Input
- [ ] Controller Input
- [ ] Debugger 

## Achievments

| ROM                   | Status | 
|-----------------------|--------|
| 01-special            | Fails  |
| 02-interrupts         | Fails  |
| 03-op sp,hl           | Fails  |
| 04-op r,imm           | PASS   |
| 05-op rp              | Fails  |
| 06-ld r,r             | PASS   |
| 07-jr,jp,call,ret,rst | PASS   |
| 08-misc instrs        | PASS   |
| 09-op r,r             | Fails  |
| 10-bit ops            | PASS   |
| 11-op a,(hl)          | Fails  |

- PASS -> ROM outputs "Passed" status
- Fails -> ROM outputs "Failed" status
- Unknown -> Emulator can not reach ROM evaluation