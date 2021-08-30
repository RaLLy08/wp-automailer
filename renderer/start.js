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
    });
});

// change loading !! under all content remove while loading
ipcRenderer.on("loading", (event, isLoading) => {
    const hasLoading = canvasLoading.classList.contains('visually-hidden')
    console.log(hasLoading);

    isLoading
        ? hasLoading && canvasLoading.classList.remove("visually-hidden")
        : !hasLoading && canvasLoading.classList.add("visually-hidden");
});

