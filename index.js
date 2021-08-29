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
// clientsStore.delete("session");

async function main () {
    let currentClientSession = clientsStore.get("session");
    // currentClientSession === undefined | currentClientSession = sesion
    const wp = new Wp({
        session: currentClientSession,
    });

    const initWindow = openInitWindow({
        onQRCode: wp.onPromised("qr"),
    });

    if (!currentClientSession) {
        // const qrcode = `1@SoBUOQORTq2AH/LfnECaCuqtx9l1ndYGx9q1H0uMzDJxdpUwTEqhJb3tcTsx758Me1Uqs4liWCfH4w==,NeaeKSHGLeNksu+pgOmhQGuYGQ+4KbbkVrTQ19JH3x4=,jRrVFGQ5ye7T/VTOrW7Sdg==`;

        const session = await wp.onPromised("authenticated");
        clientsStore.set("session", session);

        // const {
        //     wid: { user: clientNumber },
        // } = wp.info;

        //

        // store.setContacts(clientNumber, contacts);

        // wp.on("message", (message) => {
        //     console.log(message);
        //     wp.sendMessage(message.from, message.body);
        // });
    }

    // warning ! re-call
    wp.on("auth_failure", () => {
        clientsStore.delete("session");
        main();
        initWindow.close();
    });
    // 

    await wp.onPromised("ready");

    const contacts = await wp.getContacts();
    openMainWindow({ contacts });

    initWindow.close();

    /**
     * @param {Object} data - data which are used in view.
     * @param {Promise} data.onQRCode - Promise for qr code.
     */
    function openInitWindow({ onQRCode }) {
        const initWindow = new Window({
            file: path.join("renderer", "init.html"),
            width: 500,
            height: 500,
        });
        // initWindow.webContents.openDevTools({ mode: "detach" });

        initWindow.once("show", async () => {
            const qrcode = await onQRCode;

            initWindow.webContents.send("qrcode", qrcode);
        });

        return initWindow;
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
