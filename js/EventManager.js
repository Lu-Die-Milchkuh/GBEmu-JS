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
import {read_rom_info} from "./cartridge.js"
import {mmu} from "./mmu.js"
import {cpu} from "./cpu.js"

// File Input
document.querySelector("#file-input").addEventListener("change", (event) => {
    if (event.target.files.length === 1) {
        let reader = new FileReader()
        const files = event.target.files

        reader.readAsArrayBuffer(files[0])
        reader.onload = () => {
            let buffer = reader.result
            let tempArray = new Uint8Array(buffer)
            mmu.rom = Array.from(tempArray)
            read_rom_info()
            //running = true
            setRunning(true)
            setPaused(false)
            //paused = false
            run().then(() => console.log("Emulation Stopped")).catch(err => console.log(err))
        }
    }
})

// Speed Slider
document.querySelector("#speed-slider").addEventListener("input", () => {
    let value = document.querySelector("#speed-slider").value
    document.querySelector("#speed-out").value = `${value}%`
    setPaused(true)
    setRatio(value)
    setPaused(false)
})

// Stop Button
document.querySelector("#stop-button").addEventListener("click", () => {
    //running = false
    //paused = false
    setRunning(false)
    setPaused(false)
    //console.log("Stopped Emulation")
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
    setPaused(!paused)
    document.querySelector("#pause-button").textContent = paused ? "Resume" : "Pause"
    console.log(`Emulation Paused: ${paused}`)
})