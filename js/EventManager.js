"use strict"

// Reading File into memory
document.querySelector("#file-input").addEventListener("change", (event) => {
    let reader = new FileReader()
    const files = event.target.files

    reader.readAsArrayBuffer(files[0])
    reader.onload = () => {
        let buffer = reader.result
        let tempArray = new Uint8Array(buffer)
        memory.rom = Array.from(tempArray)

    }

})


document.querySelector("#speed-slider").addEventListener("input", () => {
    document.querySelector("#speed-out").value = `${document.querySelector("#speed-slider").value}%`
})