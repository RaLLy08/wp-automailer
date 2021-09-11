// "use strict";

const { ipcRenderer } = require("electron");
const { toCanvas } = require("qrcode");
const { LOADING, LOADING_TEXT, QRCODE, ERROR_TEXT } = require("../consts/actions");

const canvas = document.getElementById("canvas");
const qrcodeWrapper = document.getElementById("qrcode-wrapper");
const loadingWrapper = document.getElementById("loading-wrapper");
const loadingTitle = document.getElementById("loading-title");

ipcRenderer.on(QRCODE, (event, qrcode) => {
    qrcodeWrapper.classList.contains("visually-hidden") &&
        qrcodeWrapper.classList.remove("visually-hidden");

    toCanvas(canvas, qrcode, function (error) {
        if (error) console.error(error);
    });
});

// change loading !! under all content remove while loading
ipcRenderer.on(LOADING, (event, isLoading) => {
    isLoading ? loading() : stopLoading();
});

ipcRenderer.on(LOADING_TEXT, (event, text) => {
    loadingTitle.innerText = text;
});

function loading() {
    qrcodeWrapper.classList.add("visually-hidden");

    loadingWrapper.classList.remove("visually-hidden");
}

function stopLoading() {
    qrcodeWrapper.classList.remove("visually-hidden");

    loadingWrapper.classList.add("visually-hidden");
}
