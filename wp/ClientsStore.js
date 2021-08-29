const Store = require("electron-store");

class ClientsStore extends Store {
    constructor(settings) {
        super(settings);

        // initialize with todos or empty array

        // this.contacts = this.get("contacts") || [];
    }

    setClient(clientNumber, client) {
        // save todos to JSON file
        this.set(clientNumber, contacts);
        // returning 'this' allows method chaining
        return this;
    }

    getClient(clientNumber) {
        // set object's todos to todos in JSON file
        return this.get(clientNumber);
    }
}

module.exports = ClientsStore;
