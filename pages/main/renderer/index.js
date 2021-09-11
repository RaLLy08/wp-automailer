const { ipcRenderer } = require("electron");
const { MYCONTACTS, CHANGE_ACCOUNT, QUIT } = require("../consts/actions");

const contactsSelect = document.getElementById("select-contacts");
const contactsSelectBtn = document.getElementById("select-contacts-btn");
const contactsGetLoading = document.getElementById("contacts-get-loading");
const contactsValue = document.getElementById("contacts-value");
const changeAccountBtn = document.getElementById("change-account");
const quitBtn = document.getElementById("quit");

ipcRenderer.on(MYCONTACTS, (event, myContacts) => {
    // contactsWrapper.innerHTML = contacts.length;
    setContactsValue(myContacts.length);

    setSelectData(myContacts, (el) => el.name + " " + el.number);

});

changeAccountBtn.onclick = () => ipcRenderer.send(CHANGE_ACCOUNT);
quitBtn.onclick = () => ipcRenderer.send(QUIT);

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

function setSelectData(data, viewSelector) {
    if (!viewSelector) return;

    contactsSelect.innerHTML = `
            ${data.map(
                (el, i) => `<option value="1">${viewSelector(el, i)}</option>`
            )}`;
}

function selectSetLoading() {
    contactsGetLoading.classList.remove("visually-hidden");
    contactsSelect.setAttribute("disabled", "");
    contactsSelectBtn.setAttribute("disabled", "");
}

function selectStopLoading() {
    contactsGetLoading.classList.add("visually-hidden");
    contactsSelect.removeAttribute("disabled");
    contactsSelectBtn.removeAttribute("disabled");
}

function setContactsValue(value) {
    contactsValue.innerText = value;
}