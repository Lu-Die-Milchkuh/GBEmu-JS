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

import {setPaused, setRunning, setRatio, run, paused} from "./emulator.js"
import {keyboard_update} from "./keyboard.js"
import {cartridge, read_rom_info} from "./cartridge.js"
import {cpu} from "./cpu.js"
import {gamepad_update} from "./controller.js"
import {screen} from "./screen.js"
import {clearSerial} from "./serial.js"

// File Input
document.querySelector("#file-input").addEventListener("change", (event) => {
    if (event.target.files.length === 1) {
        let reader = new FileReader()
        const files = event.target.files

        reader.readAsArrayBuffer(files[0])
        reader.onload = () => {
            cartridge.reset()
            clearSerial()
            //screen.reset()

            let buffer = reader.result
            let tempArray = new Uint8Array(buffer)
            cartridge.rom = Array.from(tempArray)
            read_rom_info()
            setRunning(true)
            setPaused(false)
            run().then(() => console.log("Emulation Stopped")).catch(err => console.log(err))
        }
    }
})

// Speed Slider
document.querySelector("#speed-slider").addEventListener("input", () => {
    let value = document.querySelector("#speed-slider").value
    document.querySelector("#speed-out").value = `Current Emulation Speed: ${value}%`
    setPaused(true)
    setRatio(value)
    setPaused(false)
})

// Stop Button
document.querySelector("#stop-button").addEventListener("click", () => {
    setRunning(false)
    setPaused(false)
    cartridge.reset()
    screen.reset()
})

// Reset Button
document.querySelector("#reset-button").addEventListener("click", () => {
    setPaused(true)
    cpu.reset()
    console.log("Reset Emulation")
    setPaused(false)
})

// Pause Button
document.querySelector("#pause-button").addEventListener("click", () => {
    let button = document.querySelector("#pause-button")
    setPaused(!paused)
    button.textContent = paused ? "Resume" : "Pause"
    //button.style.backgroundColor = paused ? "Red" : "#7C7C7C"
    console.log(`Emulation Paused: ${paused}`)
})

// Event Listener for Keyboard Input
window.addEventListener("keypress", keyboard_update)

// Gamepad Connected Event
window.addEventListener("gamepadconnected", (e) => {
    console.log(`Gamepad: ${e.gamepad.id} connected at index ${e.gamepad.index}`)
    console.log(`Mapping: ${e.gamepad.mapping}`)

    if (navigator.userAgent.includes("Chrome")) {
        setInterval(gamepad_update, 10)
    }

})

// Gamepad Disconnect Event
window.addEventListener("gamepaddisconnected", (e) => {
    console.log(`Gamepad disconnected from index ${e.gamepad.index}: ${e.gamepad.id}`)
})

//window.addEventListener("ongamepadconnected",gamepad_update)

window.addEventListener("load", () => {
    let canvas = document.querySelector("canvas")
    let ctx = canvas.getContext('2d')
    ctx.font = '20px sans-serif'
    ctx.textAlign = "center"
    ctx.fillText("No ROM loaded", canvas.width / 2, canvas.height / 2)
})