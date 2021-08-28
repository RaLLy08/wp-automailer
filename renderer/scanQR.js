// "use strict";

const { ipcRenderer } = require("electron");
const { toCanvas } = require("qrcode");

// delete todo by its text value ( used below in event listener)
const deleteTodo = (e) => {
    ipcRenderer.send("delete-todo", e.target.textContent);
};

// create add todo window button
const canvas = document.getElementById("canvas");
const canvasLoading = document.getElementById("canvas-loading");
// TEMP
canvasLoading.style.display = 'block';
canvas.style.display = "none";
// TEMP

ipcRenderer.on("qrcode", (event, qrcode) => {
    toCanvas(canvas, qrcode, function (error) {
        if (error) console.error(error);
        // TEMP
        canvasLoading.style.display = "none";
        canvas.style.display = "block";
        // TEMP
    });
    // todoList.innerHTML = todoItems;
});
