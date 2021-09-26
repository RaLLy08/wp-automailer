const { ipcMain } = require("electron");
const path = require("path");

const Window = require("../../Window");
const {
    MY_CONTACTS,
    CONTACTS_REFRESH,
    CONTACTS_LOADING,
    SEND_MESSAGE,
} = require("./consts/actions");

class Controller {
    constructor(model, view, client) {
        this._model = model;
        this._view = view;

        this.client = client;

        this._view.once("show", async () => {
            const contacts = this._model.get("contacts");

            if (contacts) {
                this.setSelectContacts(contacts);
            } else {
                this.setSelectContacts();
            }
        });

        ipcMain.on(SEND_MESSAGE, (_, chats, message) => {
            this.broadcastMessage(chats, message);
        });

        ipcMain.on(CONTACTS_REFRESH, () => {
            this.setSelectContacts();
        });
    }

    setSelectContacts = async (data, selector = (el) => el.isMyContact) => {
        let contacts = data;

        if (!data) {
            this._view.webContents.send(CONTACTS_LOADING, true);

            contacts = await this.client.getContacts();

            this._model.set("contacts", contacts);

            this._view.webContents.send(CONTACTS_LOADING, false);
        }

        this._view.webContents.send(MY_CONTACTS, contacts.filter(selector));
    };

    broadcastMessage = async (chats, message) => {
        for (const chatId of chats) {
            await this.client.sendMessage(chatId, message);
        }
    };

    closeWindow = () => {
        this._view.close();
    };

    isReady = () => {};
}

module.exports = (store, readyClient) =>
    new Controller(
        store,
        new Window({
            file: path.resolve(path.join(__dirname, "/renderer"), "index.html"),
        }),
        readyClient
    );
