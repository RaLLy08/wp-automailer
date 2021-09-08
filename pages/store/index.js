const Store = require("electron-store");

class ClientStore extends Store {

    removeClient() {
        this.delete('session');
    }
}
