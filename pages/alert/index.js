const path = require("path");
const { ipcMain } = require("electron");

const Window = require("../../Window");
const { MESSAGE, ALERT_CONFIRM } = require("./consts");

class Alert {
    constructor(message, view) {
        this._view = view;
        this.message = message

        this.confirmCb = null;

        this._view.once("show", async () => {
            this._view.webContents.send(MESSAGE, message);
        });

        ipcMain.on(ALERT_CONFIRM, () => {
            this.confirmCb && this.confirmCb(); 
            this._view.close();
        });
    }

    onConfirm = (cb) => {
        this.confirmCb = cb;
    };
}

module.exports = (message) =>
    new Alert(
        message,
        new Window({
            file: path.resolve(path.join(__dirname, "/renderer"), "index.html"),
            width: 300,
            height: 200,
        })
    );
