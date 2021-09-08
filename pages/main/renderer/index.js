const { ipcRenderer } = require("electron");
const { MYCONTACTS } = require("../consts/actions");

const contactsWrapper = document.getElementById("contacts");
const quitBtn = document.getElementById("quit");

ipcRenderer.on(MYCONTACTS, (event, myContacts) => {
    // contactsWrapper.innerHTML = contacts.length;

    contactsWrapper.innerHTML = `<select class="form-select" aria-label="Default select example">
        ${myContacts.map(
            (el, i) =>
                `<option value="1">${el.name + " " + el.number}</option>`
        )}
        </select>`;

});

quitBtn.onclick = () => ipcRenderer.send('quit');

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
        

//         contactsWrapper.innerHTML = `<select class="form-select" aria-label="Default select example">
//             ${myContacts.map(
//                 (el, i) =>
//                     `<option value="1">${el.name + " " + el.number}</option>`
//             )}
//                 </select>`;

//     }
// );