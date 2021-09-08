const { ipcMain } = require("electron");
const Store = require("electron-store");
const Window = require("../Window");

const getAuthClientPage = require("./authClient");
const getMainPage = require("./main");
const getAlertWindow = require("./alert");


const clientStore = new Store({ name: "client" });

let аuthClientPage = null;
let mainPage = null;

const init = () => {
    аuthClientPage = getAuthClientPage(clientStore);

    аuthClientPage.onClientReady().then((readyClient) => {
        mainPage = getMainPage(clientStore, readyClient);
        
        const rerun = () => {
            clientStore.clear();

            init();
            mainPage.closeWindow();
        }

        readyClient.on("disconnected", () => {
            const alertWindow = getAlertWindow('Disconected');

            alertWindow.onConfirm(() => {
                rerun();
            });
        });

        ipcMain.on("quit", rerun);


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