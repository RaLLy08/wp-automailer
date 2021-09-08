const { ipcRenderer } = require("electron");
const { MYCONTACTS } = require("../consts/actions");

const contactsWrapper = document.getElementById("contacts");


ipcRenderer.on(MYCONTACTS, (event, contacts) => {
    // contactsWrapper.innerHTML = contacts.length;

    const myContacts = JSON.parse(contacts);

    contactsWrapper.innerHTML = `<select class="form-select" aria-label="Default select example">
        ${myContacts.map(
            (el, i) =>
                `<option value="1">${el.name + " " + el.number}</option>`
        )}
        </select>`;

});



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