const { ipcMain } = require("electron");
const Store = require("electron-store");
const Window = require("../Window");

const getAuthClientPage = require("./authClient");
const getMainPage = require("./main");
const getAlertWindow = require("./alert");
const { CHANGE_ACCOUNT } = require("./main/consts/actions");


const clientStore = new Store({ name: "client" });

let аuthClientPage = null;
let mainPage = null;

const init = () => {
    аuthClientPage = getAuthClientPage(clientStore);

    аuthClientPage.onClientReady().then((readyClient) => {

        mainPage = getMainPage(clientStore, readyClient);

        readyClient.on("disconnected", () => {
            const alertWindow = getAlertWindow('Disconected');
            clientStore.clear();

            alertWindow.onConfirm(() => {
                init();
                mainPage.closeWindow();
            });
        });

        ipcMain.on(CHANGE_ACCOUNT, () => {
            clientStore.clear();

            init();
            mainPage.closeWindow();
        });

        аuthClientPage.closeWindow();
    });
}

init()





/*
    readyClient.on("message", (message) => {
        if (message.body.toLowerCase().match()) {
            message.getChat().then((e) => {
                console.log(e);
                message.reply(
                    message.body.replaceAll(, "cам")
                );
            });
            return;
        }


        message.reply(message.body.split("").reverse().join(""));

        // message.getChat().then((e) => console.log(e));
    });
*/