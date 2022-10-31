"use strict"

import {mmu} from "./mmu.js"
import {cpu} from "./cpu.js"
import {screen} from "./screen.js"

export let gpu = {
    vram: new Array(0x2000),
    oam: new Array(0x9F),   // Object Attribute
    frame_buffer: new Array(160 * 144),
    clock: 0,
    mode: 2,
    line: 0,
    frameBuffer: new Array(screen.width * screen.height),   // Store the whole frame
    tileBuffer: new Array(8),
    bgTileCache: {}
}

gpu.update = (cycles) => {
    let vblank = false
    gpu.clock += cycles
    let stat = mmu.read(0xFF41)
}

// Tile Data stored at 0x8000 - 0x97FF, each tile takes 16 Bytes!
gpu.RenderTiles = () => {}

gpu.RenderBackground = () => {}
gpu.RenderWindow = () => {}
gpu.reset = () => {
    gpu.clock = 0
}