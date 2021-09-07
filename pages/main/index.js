const { Client } = require("whatsapp-web.js");
const Store = require("electron-store");
const Window = require("../../Window");
const path = require("path");

class Controller {
    constructor(model, view, client) {
        this._model = model;
        this._view = view;
        this.client = client;
        
    }
}

module.exports = (readyClient) =>
    new Controller(
        null, // new Store({ name: "clients" })
        new Window({
            file: path.resolve(path.join(__dirname, "/renderer"), "index.html"),
        }),
        readyClient
    );
