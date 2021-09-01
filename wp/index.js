const { Client } = require("whatsapp-web.js");




class Wp extends Client {
    constructor(settings) {
        super(settings);
        this.initialize();
    }

    // onPromised(type) { 
    //     return new Promise((res, rej) => {
    //         this.on(type, res)
    //     })
    // }
}

module.exports = () => new Wp();