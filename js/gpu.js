"use strict"

let gpu = {
    vram: new Array(0x2000)
}

function draw() {
    let canvas = document.getElementById("#game-screen")//document.querySelector('#game-screen')
    let context = canvas.getContext('2d')
    context.fillStyle = "#FF0000";
    context.fillRect(0, 0, 150, 75);

}