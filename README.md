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

| ROM  | Status | 
|----------------------|--------|
|01-special|Untested|
|02-interrupts|Fails|
|03-op sp,hl|Fails|
|04-op r,imm|Unknown|
|05-op rp|Unknown|
|06-ld r,r|PASS|
|07-jr,jp,call,ret,rst | PASS |
|08-misc instrs|PASS|
|09-op r,r|Unknown|
|10-bit ops|Fails|
|11-op a,(hl)|Unknown|

- PASS -> ROM outputs "Passed" status
- Fails -> ROM outputs "Failed" status
- Unknown -> Emulator can not reach ROM evaluation