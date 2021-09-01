const Store = require("electron-store");

class Model {
    constructor() {
        this.clientsStore = new Store({ name: "clients" });
    }

    removeSession() {
        this.clientsStore.delete("session");
    }

    setSession(session) {
        this.clientsStore.set("session", session);
    }

    getSession() {
        return this.clientsStore.get("session");
    }
}

module.exports = Model;
