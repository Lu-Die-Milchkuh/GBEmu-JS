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

import { gpu } from "./gpu.js"

export let screen = {
    canvas: null,
    context: null,
    content: null
}

screen.init = () => {
    screen.canvas = document.querySelector("#game-screen")
    screen.context = screen.canvas.getContext('2d')
    screen.content = screen.context.createImageData(320, 288)
}

screen.reset = () => {
    if (screen.context !== null) {
        screen.context.data = []
        screen.context.fillStyle = "#67B835"
        setTimeout(() => {
            screen.context.fillRect(0, 0, screen.canvas.width, screen.canvas.height)
        }, 100)
    }
}

screen.update = () => {

    // for (let y = 0; y < 144; y++) {
    //     for (let py = 0; py < 2; py++) {
    //         let yOffset = (y * 2 + py) * 320
    //         for (let x = 0; x < 160; x++) {
    //             for (let px = 0; px < 2; px++) {
    //                 let offset = yOffset + (x * 2 + px)
    //                 let colors = gpu.frame_buffer[y * 160 + x | 0]
    //                 // set RGB values
    //                 screen.content.data[offset * 4] = colors[0]
    //                 screen.content.data[offset * 4 + 1] = colors[1]
    //                 screen.content.data[offset * 4 + 2] = colors[2]
    //                 screen.content.data[offset * 4 + 3] = 255
    //             }
    //         }
    //     }
    // }

    let j = 0
    for (let i = 0; i < gpu.frame_buffer.length; i++) {

        let colors = gpu.frame_buffer[i]

        //set RGB values
        screen.content.data[j] = colors[0]
        screen.content.data[j + 1] = colors[1]
        screen.content.data[j + 2] = colors[2]
        screen.content.data[j + 3] = 255

        screen.content.data[j + 4] = colors[0]
        screen.content.data[j + 5] = colors[1]
        screen.content.data[j + 6] = colors[2]
        screen.content.data[j + 7] = 255

        j += 8
    }

    screen.context.putImageData(screen.content, 0, 0)
}
