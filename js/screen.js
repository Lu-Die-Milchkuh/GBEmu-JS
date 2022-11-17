"use strict"

import {gpu} from "./gpu.js"

export let screen = {
    canvas: undefined,
    context: undefined,

    //frequency: 60,
    //pixel_size: 2,
    content: undefined
}

screen.colors = [
    [0x00, 0x00, 0x00], // Black
    [0x55, 0x55, 0x55], // Grey
    [0xAA, 0xAA, 0xAA], // Light Grey
    [0xFF, 0xFF, 0xFF], // White
]

screen.init = () => {
    screen.canvas = document.querySelector("#game-screen")
    screen.context = screen.canvas.getContext('2d')
    screen.content = screen.context.createImageData(320,288)

}

screen.update = () => {

    for (let y = 0; y < 144; y++) {
        for (let py = 0; py < 2; py++) {
            let yOffset = (y * 2 + py) * 320;
            for (let x = 0; x < 160; x++) {
                for (let px = 0; px < 2; px++) {
                    let offset = yOffset + (x * 2 + px);
                    let v = gpu.frame_buffer[y*160 + x | 0]
                    // set RGB values
                    screen.content.data[offset * 4] = v[0]
                    screen.content.data[offset * 4 + 1] = v[1]
                    screen.content.data[offset * 4 + 2] = v[2]
                    screen.content.data[offset * 4 + 3] = 255
                }
            }
        }
    }

    screen.context.putImageData(screen.content,0,0)

}