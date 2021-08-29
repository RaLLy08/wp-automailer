const { Client } = require("whatsapp-web.js");


// client.on("qr", (qr) => {
//     console.log("QR RECEIVED", qr);
// });

// client.on("ready", () => {
//     console.log("Client is ready!");
// });

// client.initialize();


class Wp extends Client {
    constructor() {
        super();
        this.initialize();
    }

    onPromised(type) { 
        return new Promise((res, rej) => {
            this.on(type, res)
        })
    }
}

module.exports = Wp;