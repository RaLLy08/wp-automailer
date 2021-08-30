// "use strict";

const path = require("path");
const { app, ipcMain } = require("electron");

const Window = require("./Window");
const Wp = require("./wp");
const DataStore = require("./DataStore");
const ClientsStore = require("./wp/ClientsStore");
const { on } = require("events");


require("electron-reload")(__dirname);

const contactsStore = new DataStore({ name: "contacts" });
const clientsStore = new ClientsStore({ name: "clients" });
clientsStore.set('session', {})
// clientsStore.delete('session')
class Main {
    constructor() {
        this.session = clientsStore.get("session") || null;
        this.loading = true; //
        this.client = null;
        this.initWindow = null;

        this.setClient();
        this.setInitWindow({
            initialLoading: this.loading,
        });

        this.initialize();

        this.client.on("auth_failure", () => {
            this.session = null;
            this.removeSession();
            
            this.initWindow.webContents.send(
                "error",
                "something wrong, restarting app.."
            );


            this.setClient();
            this.initialize();
        });
    }

    setClient = () => {
        this.client = new Wp({
            session: this.session,
        });
    };

    initialize = () => {
        this.client.on("qr", (qrcode) => {
            this.initWindow.webContents.send("qrcode", qrcode);

            if (this.loading) {
                this.initWindow.webContents.send("loading", false);
                this.loading = false;
            }
        });

        this.client.on("authenticated", (session) => {
            if (!this.session) {
                this.session = session;
                this.saveSession();
            }
        });

        this.client.on("ready", () => {
            this.openMainWindow({ contacts: [1] });
            // new MainWindow
            this.initWindow.close();
        });
    };

    removeSession() {
        clientsStore.delete("session");
    }

    saveSession() {
        clientsStore.set("session", this.session);
    }

    setInitWindow({ initialLoading }) {
        this.initWindow = new Window({
            file: path.join("renderer", "init.html"),
            width: 500,
            height: 500,
        });
        // initWindow.webContents.openDevTools({ mode: "detach" });

        // this.subscribe("qrcodedisplay", (qrcode) =>
        //     initWindow.webContents.send("qrcode", qrcode)
        // );

        // this.subscribe("loading", (loading) =>
        //     initWindow.webContents.send("loading", loading)
        // );

        this.initWindow.once("show", () => {
            // initial loading
            this.initWindow.webContents.send("loading", initialLoading);
        });
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
