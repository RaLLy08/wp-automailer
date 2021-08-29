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
clientsStore.set('session', {})

class Main {
    constructor() {
        this.session = clientsStore.get("session") || null;
        this.loading = true; // 
        
        this.initWindow = this.initClient();

        this.wp.on("auth_failure", () => {
            this.session = null;
            this.removeSession();

            console.log("failed");
            // this.reInitClient();
        });

        this.wp.on("ready", () => {
            this.openMainWindow({ contacts: [1] });

            this.initWindow.close();
        });

        this.wp.on("authenticated", (session) => {
            if (!this.session) {
                this.session = session;
                saveSession();
            }
        });

        // this.wp.on("qr", (qr) => {
        //     this.loading = false; // 
        // });
    }

    removeSession() {
        clientsStore.delete("session");
    }

    saveSession() {
        clientsStore.set("session", this.session);
    }
    // warn
    reInitClient = () => {
        const newWindow = this.initClient();
        this.initWindow.close();

        this.initWindow = newWindow;
    }
    // 
    initClient = () => {
        this.wp = new Wp({
            session: this.session,
        });

        //this.initWindow && initWindow.close();

        return this.openInitWindow({
            onQRCode: (onQRListener, setLoading) => {
                let firstLoading = false;
                setLoading(true);

                this.wp.on("qr", (qr) => {
                    onQRListener(qr);
                    firstLoading || setLoading(false);
                    firstLoading = true;
                });
            },
        });
    };

    openInitWindow({ onQRCode }) {
        const initWindow = new Window({
            file: path.join("renderer", "init.html"),
            width: 500,
            height: 500,
        });
        // initWindow.webContents.openDevTools({ mode: "detach" });

        initWindow.once("show", async () => {
            onQRCode(
                (qrcode) => initWindow.webContents.send("qrcode", qrcode),
                (loading) => initWindow.webContents.send("loading", loading)
            );
        });

        return initWindow;
    }

    openMainWindow({ contacts }) {
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


app.on("ready", () => new Main);

app.on("window-all-closed", function () {
    app.quit();
});
