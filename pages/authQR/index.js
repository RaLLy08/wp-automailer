const { Client } = require("whatsapp-web.js");
const Store = require("electron-store");
const Window = require("../../Window");
const path = require("path");
const { SESSION, LOADING, LOADING_TEXT, QRCODE } = require("./consts/actions");
const { eng } = require("../../texts/authQR");

class Controller {
    constructor(model, view) {
        this._model = model;
        this._view = view;
       
        this.onClientReadyCb = null;
        this.isQRLoaded = false;
        this.session = this._model.get(SESSION);

        this._view.once("show", () => {
            this._view.webContents.send(LOADING, true);

            if (!this.session) {
                this._view.webContents.send(LOADING_TEXT, eng.LOADING_QR);
            } else {
                this._view.webContents.send(
                    LOADING_TEXT,
                    eng.WAIT_AUTH
                );
            }
        });

        this.initialize(this.session);

        this.client.on("auth_failure", () => {
            this._model.delete(SESSION);
            this.session = null;
            this._view.webContents.send(
                LOADING_TEXT,
                eng.ERROR_RESTARTING
            );

            this.initialize(null);
        });
    }

    onClientReady = (cb) => {
        this.onClientReadyCb = cb;
    };

    initialize = () => {
        this.client = new Client({
            session: this.session,
        });

        this.client.initialize();

        this.client.on("qr", (qrcode) => {
            this._view.webContents.send(QRCODE, qrcode);

            if (!this.isQRLoaded) {
                this.isQRLoaded = true;
                this._view.webContents.send(LOADING, false);
            }
        });

        this.client.on("authenticated", (session) => {
            if (!this.session) {
                this.session = session;
                this._model.set(SESSION, session);
            }
        });

        this.client.on("ready", () => {
            this.onClientReadyCb &&
                this.onClientReadyCb(this.client, this._view);
            // this.openMainWindow({ contacts: [1] });
            // new MainWindow
            // this.initWindow.close();
            this._view.webContents.send(LOADING, true);
            this._view.webContents.send(LOADING_TEXT, eng.LAUNCHING);
        });
    };
}

module.exports = () =>
    new Controller(
        new Store({ name: "clients" }),
        new Window({
            file: path.resolve(path.join(__dirname, "/renderer"), "index.html"),
            width: 500,
            height: 500,
        })
    );
