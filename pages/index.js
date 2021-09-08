const Store = require("electron-store");

const getAuthClientPage = require("./authClient");
const getMainPage = require("./main");


const store = new Store({ name: "client" });

const аuthClientPage = getAuthClientPage(store);


аuthClientPage.onClientReady().then((readyClient) => {
    const mainPage = getMainPage(store, readyClient);

    аuthClientPage.closeWindow();
});







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