// "use strict";

const { app, ipcMain } = require("electron");
const { QUIT } = require("./pages/main/consts/actions");
 

require("electron-reload")(__dirname);


app.on("ready", () => require("./pages"));

app.on("window-all-closed", function() {
    app.quit();
});

ipcMain.on(QUIT, function() {
    app.quit();
});