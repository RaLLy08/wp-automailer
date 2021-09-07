const { ipcRenderer } = require("electron");
const { CONTACTS } = require("../consts/actions");

const contactsWrapper = document.getElementById("contacts");


ipcRenderer.on(CONTACTS, (event, contacts) => {
    contactsWrapper.innerHTML = contacts.length;
});