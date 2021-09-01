// "use strict";

const { app, ipcMain } = require("electron");
 

require("electron-reload")(__dirname);


app.on("ready", () => require("./pages"));

app.on("window-all-closed", function () {
    app.quit();
});
