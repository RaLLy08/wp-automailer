// "use strict";

const { ipcRenderer } = require("electron");
const { toCanvas } = require("qrcode");

// delete todo by its text value ( used below in event listener)
const deleteTodo = (e) => {
    ipcRenderer.send("delete-todo", e.target.textContent);
};

const canvas = document.getElementById("canvas");
const canvasLoading = document.getElementById("qrcode-loading");

const header = document.getElementById("header");

ipcRenderer.on("qrcode", (event, qrcode) => {
    toCanvas(canvas, qrcode, function (error) {
        if (error) console.error(error);
        canvasLoading.classList.toggle("visually-hidden");
        header.classList.toggle("visually-hidden");
    });
});
