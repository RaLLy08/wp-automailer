// "use strict";

const path = require("path");
const { app, ipcMain } = require("electron");

const Window = require("./Window");
const Wp = require("./wp");
const DataStore = require("./DataStore");
const ClientsStore = require("./wp/ClientsStore");


require("electron-reload")(__dirname);
const contactsStore = new DataStore({ name: "contacts" });

const clientsStore = new ClientsStore({ name: "clients" });

async function main () {
    // let currentClient = clientsStore.get('phonenumber');
    let currentClient = false;

    if (currentClient) {
    } else {
        const wp = new Wp();
        // const qrcode = `1@SoBUOQORTq2AH/LfnECaCuqtx9l1ndYGx9q1H0uMzDJxdpUwTEqhJb3tcTsx758Me1Uqs4liWCfH4w==,NeaeKSHGLeNksu+pgOmhQGuYGQ+4KbbkVrTQ19JH3x4=,jRrVFGQ5ye7T/VTOrW7Sdg==`;
        const scanQRWindow = openScanQRWindow({
            onQRCode: wp.onPromised("qr"),
        });

        await wp.onPromised("ready");


        const {
            wid: { user: clientNumber },
        } = wp.info;

        //

        // store.setContacts(clientNumber, contacts);

        // wp.on("message", (message) => {
        //     console.log(message);
        //     wp.sendMessage(message.from, message.body);
        // });

        scanQRWindow.close();
    }

    openMainWindow({ contacts: [1, 2, 3] });

    /**
     * @param {Object} data - data which are used in view.
     * @param {Promise} data.onQRCode - Promise for qr code.
     */
    function openScanQRWindow({ onQRCode }) {
        const scanQRWindow = new Window({
            file: path.join("renderer", "scanQR.html"),
            width: 500,
            height: 500,
        });
        // scanQRWindow.webContents.openDevTools({ mode: "detach" });

        scanQRWindow.once("show", async () => {
            const qrcode = await onQRCode;

            scanQRWindow.webContents.send("qrcode", qrcode);
        });

        return scanQRWindow;
    }

    /**
     * @param {Object} data - data which are used in view.
     * @param {Array} data.contacts - contacts
     */
    function openMainWindow({ contacts }) {
        const mainWindow = new Window({
            file: path.join("renderer", "main.html"),
        });

        mainWindow.webContents.openDevTools({ mode: "detach" });

        mainWindow.once("show", async () => {
            // const contacts = await wp.getContacts();

            mainWindow.webContents.send("contacts", contacts);
        });

        return mainWindow;
    }
}

app.on("ready", main);

app.on("window-all-closed", function () {
    app.quit();
});
