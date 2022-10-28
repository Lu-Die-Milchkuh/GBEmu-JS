"use strict"

// Reading File into mmu
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
            running = true
            paused = false
            run()
        }
    }
})

// Speed Slider
document.querySelector("#speed-slider").addEventListener("input", () => {
    document.querySelector("#speed-out").value = `${document.querySelector("#speed-slider").value}%`
    paused = true
    ratio = document.querySelector("#speed-slider").value / 100
    console.log(`Speed Ratio: ${ratio}`)
    paused = false
})

// Stop Button
document.querySelector("#stop-button").addEventListener("click", () => {
    running = false
    paused = false
    console.log("Stopped Emulation")
})

// Reset Button
document.querySelector("#reset-button").addEventListener("click", () => {
    paused = true
    cpu.reset()
    console.log("Reset Emulation")
    paused = false
})

// Pause Button
document.querySelector("#pause-button").addEventListener("click", () => {
    paused = !paused
    document.querySelector("#pause-button").textContent = paused ? "Resume" : "Pause"
})