const { Client } = require("whatsapp-web.js");

class Controller {
    constructor(model, view) {
        this._model = model;
        this._view = view;
        this.onClientReadyCb = null;
        this.isQRLoaded = false;
        this.session = this._model.getSession();

        this._view.onShow(() => {
            this._view.loading();

            if (!this.session) {
                this._view.setLoadingText("Loading QR code");
            } else {
                this._view.setLoadingText("Waiting for authorization");
            };
        })

        this.initialize(this.session);

        this.client.on("auth_failure", () => {
            this._model.removeSession();
            this.session = null;
            this._view.setLoadingText("Something wrong: restarting..");

            console.log("err");
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
            this._view.setQR(qrcode);

            if (!this.isQRLoaded) {
                this.isQRLoaded = true;;
                this._view.stopLoading();
            }
        });

        this.client.on("authenticated", (session) => {
            if (!this.session) {
                this.session = session;
                this._model.setSession(session);
            }
        });

        this.client.on("ready", () => {
            this.onClientReadyCb && this.onClientReadyCb(this.client, this._view);
            // this.openMainWindow({ contacts: [1] });
            // new MainWindow
            // this.initWindow.close();
            this._view.loading();
            this._view.setLoadingText("Launching");
        });
    };
}

module.exports = Controller;

