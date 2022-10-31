"use strict"

export let screen = {
    canvas: undefined,
    context: undefined,
    width: 160,     // Physical Screen Width
    height: 144,    // Physical Screen Height
    frequency: 60,
    pixel_size: 2
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
}