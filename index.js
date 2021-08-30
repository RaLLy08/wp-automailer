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
// clientsStore.set('session', {})
clientsStore.delete('session')
class EventEmitter {
    constructor() {
        this._events = [];
    }

    subscribe(event, listener) {
        if (!Array.isArray(this._events[event])) {
            this._events[event] = [];
        }
        console.log(event, 'subscribed');
        this._events[event].push(listener);
    }

    emit(event, arg) {
        if (Array.isArray(this._events[event])) {
            this._events[event].slice().forEach((lsn) => lsn(arg));
            console.log(event, "emited", arg);
        }
    }
}


class Main extends EventEmitter {
    constructor() {
        super();
        
        this.session = clientsStore.get("session") || null;
        this.loading = true; //

        this.initWindow = this.openInitWindow();
        
        this.client = this.initClient();

        this.client.on("qr", (qr) => {
            this.emit("qrcodedisplay", qr);

            if (this.loading) {
                this.emit("loading", false);
                this.loading = false;
            }
        });

        this.client.on("auth_failure", () => {
            this.session = null;
            this.removeSession();

            console.log("failed");
            this.initClient();
        });

        this.client.on("authenticated", (session) => {
            if (!this.session) {
                this.session = session;
                saveSession();
            }
        });

        this.client.on("ready", () => {
            this.openMainWindow({ contacts: [1] });
            // new MainWindow
            this.initWindow.close();
        });
    }

    removeSession() {
        clientsStore.delete("session");
    }

    saveSession() {
        clientsStore.set("session", this.session);
    }

    initClient = () => {
        return new Wp({
            session: this.session,
        });
    };

    openInitWindow() {
        const initWindow = new Window({
            file: path.join("renderer", "init.html"),
            width: 500,
            height: 500,
        });
        // initWindow.webContents.openDevTools({ mode: "detach" });
  
        this.subscribe("qrcodedisplay", (qrcode) =>
            initWindow.webContents.send("qrcode", qrcode)
        );

        this.subscribe("loading", (loading) =>
            initWindow.webContents.send("loading", loading)
        );

        initWindow.once("show", () => {
            // initial loading
            this.emit("loading", this.loading);
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
