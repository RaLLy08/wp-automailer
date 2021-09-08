const { ipcRenderer } = require("electron");
const { MESSAGE } = require("../consts");


const messageLine = document.getElementById("msg");
const confirmBtn = document.getElementById("btn-confirm");

ipcRenderer.on(MESSAGE, (event, text) => {
    messageLine.innerText = text;
});

confirmBtn.onclick = () => {
    ipcRenderer.send("alert-confirm");
};