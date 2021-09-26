const { ipcRenderer } = require("electron");
const {
    MY_CONTACTS,
    CHANGE_ACCOUNT,
    QUIT,
    CONTACTS_REFRESH,
    CONTACTS_LOADING,
    SEND_MESSAGE,
} = require("../consts/actions");

const contactsSelect = document.getElementById("select-contacts");
const contactsSelectRefreshBtn = document.getElementById("select-contacts-refresh-btn");
const contactsGetLoading = document.getElementById("contacts-get-loading");
const contactsValue = document.getElementById("contacts-value");
const changeAccountBtn = document.getElementById("change-account");
const quitBtn = document.getElementById("quit");

const sendBtn = document.getElementById("send");
const messageTextarea = document.getElementById("message");

ipcRenderer.on(MY_CONTACTS, (event, myContacts) => {
    // contactsWrapper.innerHTML = contacts.length;
    setContactsValue(myContacts.length);

    setSelectData(myContacts);
});

ipcRenderer.on(CONTACTS_LOADING, (event, isLoading) => {
    isLoading ? contactsSetLoading() : contactsStopLoading();
});


changeAccountBtn.onclick = () => ipcRenderer.send(CHANGE_ACCOUNT);
quitBtn.onclick = () => ipcRenderer.send(QUIT);
contactsSelectRefreshBtn.onclick = () => ipcRenderer.send(CONTACTS_REFRESH);
sendBtn.onclick = () =>
    ipcRenderer.send(SEND_MESSAGE, [contactsSelect.value], messageTextarea.value);
// for TEST 
// const fs = require("fs");

// fs.readFile(
//     "/Users/RaLLy/AppData/Roaming/wp-automailer/client.json",
//     "utf8",
//     (err, data) => {
//         if (err) {
//             console.error(err);
//             return;
//         }
//         const myContacts = JSON.parse(data).myContacts;
        
//         setContactsValue(myContacts.length);

//         setSelectData(myContacts, (el) => el.name + " " + el.number);

        
//     }
// );

function setSelectData(data) {
    contactsSelect.innerHTML = `
            ${data.map(
                (el, i) =>
                    `<option value="${el.id._serialized}">${
                        el.name + " " + el.number
                    }</option>`
            )}`;
}

function contactsSetLoading() {
    contactsGetLoading.classList.remove("visually-hidden");
    contactsSelect.setAttribute("disabled", "");
    contactsSelectRefreshBtn.setAttribute("disabled", "");
}

function contactsStopLoading() {
    contactsGetLoading.classList.add("visually-hidden");
    contactsSelect.removeAttribute("disabled");
    contactsSelectRefreshBtn.removeAttribute("disabled");
}

function setContactsValue(value) {
    contactsValue.innerText = value;
}