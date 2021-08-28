// "use strict";

const path = require("path");
const { app, ipcMain } = require("electron");

const Window = require("./Window");
const Wp = require("./wp");

require("electron-reload")(__dirname);

// create a new todo store name "Todos Main"

function main() {
    // todo list window
    const scanQRWindow = new Window({
        file: path.join("renderer", "scanQR.html"),
        width: 400,
        height: 400,
    });

    scanQRWindow.once("show", () => {
        const wp = new Wp();

        wp.onQr((qr) => {
            scanQRWindow.webContents.send("qrcode", qr);
        });

        wp.on("ready", () => {
            const mainWindow = new Window({
                file: path.join("renderer", "main.html"),
            });

            scanQRWindow.close();

            // wp.getContacts().then((e) => console.log(e));


            // wp.on("message", (message) => {
            //     console.log(message);
            //     wp.sendMessage(message.from, message.body);
            // });
        });

    });
}

app.on("ready", main);

app.on("window-all-closed", function () {
    app.quit();
});
