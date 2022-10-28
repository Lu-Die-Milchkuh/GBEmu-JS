"use strict"

export let gpu = {
    vram: new Array(0x2000),
    oam: new Array(0x9F)
}

gpu.draw = () => {
    let canvas = document.getElementById("#game-screen")//document.querySelector('#game-screen')
    let context = canvas.getContext('2d')
    context.fillStyle = "#FF0000";
    context.fillRect(0, 0, 150, 75);

}