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

let serial_content = []

export function setSerial(foo) {
    serial_content.push(foo)
}

export function clearSerial() {
    serial_content = []
    let serial_out = document.querySelector("#serial")
    if(serial_out) {
        serial_out.remove()
    }
}

export function checkSerial() {

    let serial_out = document.querySelector("#serial")
    if (serial_out) {
        serial_out.remove()
    }

    serial_out = document.createElement("output")
    serial_out.id = "serial"
    serial_out.style.border = "5px solid black"
    serial_out.style.wordBreak = "break-word"


    let content = "Serial Output: <br><br>"

    serial_content.forEach((char) => {
        content += String.fromCharCode(char)
    })


    serial_out.innerHTML = content
    document.querySelector("#info-block").append(serial_out)
}
