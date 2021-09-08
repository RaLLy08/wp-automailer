const Store = require("electron-store");
const Window = require("../../Window");
const path = require("path");
const { MYCONTACTS } = require("./consts/actions");

class Controller {
    constructor(model, view, client) {
        this._model = model;
        this._view = view;

        this.client = client;
        
        this._view.once("show", async () => {
            let myContacts = this._model.get("myContacts");

            if (!myContacts) {
                
                const contacts = await this.client.getContacts();

                myContacts = contacts.filter((el) => el.isMyContact);

                model.set("myContacts", myContacts);
            }

            this._view.webContents.send(MYCONTACTS, myContacts);
        });

       
    }
    // setMyContacts = () => {
    //     this.client.getContacts().then((contacts) => {
    //         model.set(
    //             "contacts",
    //             contacts.filter((el) => el.isMyContact)
    //         );
    //     });
    // }
    closeWindow = () => {
        this._view.close();
    }

    isReady = () => {

    }
}

module.exports = (store, readyClient) =>
    new Controller(
        store,
        new Window({
            file: path.resolve(path.join(__dirname, "/renderer"), "index.html"),
        }),
        readyClient
    );
