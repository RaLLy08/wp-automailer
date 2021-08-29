const { ipcRenderer } = require("electron");

const contactsWrapper = document.getElementById("contacts");


ipcRenderer.on("contacts", (event, contacts) => {
    contactsWrapper.innerHTML = contacts.length;
});