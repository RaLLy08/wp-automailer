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

    onQr(cb) {
        this.on('qr', cb);
    }
}

module.exports = Wp;