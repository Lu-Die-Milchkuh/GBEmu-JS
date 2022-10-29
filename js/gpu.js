"use strict"

import {mmu} from "./mmu.js"
import {cpu} from "./cpu.js"

export let gpu = {
    vram: new Array(0x2000),
    oam: new Array(0x9F),   // Object Attribute
    frame_buffer: new Array(160 * 144),
    clock: 0,
    mode: 2,
    line: 0
}

gpu.setMode = (x) => {
    gpu.mode = x
    let newSTAT = mmu.read(0xFF41)
    newSTAT &= 0xFC;
    newSTAT |= gpu.mode;
    mmu.write(newSTAT,0xFF41)

    if (gpu.mode < 3) {
        if (newSTAT & (1 << (3 + gpu.mode))) {
            cpu.requestInterrupt(1)
        }
    }
}

gpu.update = (cycles) => {
    gpu.clock += cycles
    let vblank = false
    switch (gpu.mode) {
        case 0: // HBLANK
            if (gpu.clock >= 204) {
                gpu.clock -= 204
                gpu.line++;
                gpu.updateLY();
                if (gpu.line === 144) {
                    gpu.setMode(1)
                    vblank = true
                    cpu.requestInterrupt(0)
                    gpu.drawFrame()
                } else {
                    gpu.setMode(2)
                }
            }
            break

        case 1: // VBLANK
            if (gpu.clock >= 456) {
                gpu.clock -= 456;
                gpu.line++;
                if (gpu.line > 153) {
                    gpu.line = 0
                    gpu.setMode(2)
                }
                gpu.updateLY();
            }
            break

        case 2: // SCANLINE OAM
            if (gpu.clock >= 80) {
                gpu.clock -= 80
                gpu.setMode(3)
            }
            break

        case 3: // SCANLINE VRAM
            if (gpu.clock >= 172) {
                gpu.clock -= 172;
                gpu.drawScanLine(this.line);
                gpu.setMode(0)
            }
            break
    }

    return vblank;
}

gpu.updateLY = () => {}

gpu.update_scanline = () => {
    let byte = mmu.read(0xFF40)

    if(byte & (1<<0)) {
        // Background
    }
    else if(byte & (1<<5)) {
        // Window
    }
    else if (byte & (1<<2)) {
        // Sprites
    }
}