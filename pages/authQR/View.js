const Window = require("../../Window");
const path = require("path");

class View {
    constructor() {
        this.startWindow = new Window({
            file: path.resolve(path.join(__dirname, "/renderer"), "index.html"),
            width: 500,
            height: 500,
        });
        // startWindow.webContents.openDevTools({ mode: "detach" });
        // this.subscribe("qrcodedisplay", (qrcode) =>
        //     startWindow.webContents.send("qrcode", qrcode)
        // );

        // this.subscribe("loading", (loading) =>
        //     startWindow.webContents.send("loading", loading)
        // );
    }
    onShow(cb) {
        this.startWindow.once("show", () => {
            // initial loading
            cb();
        });
    }

    loading() {
        this.startWindow.webContents.send("loading", true);
    }

    stopLoading() {
        this.startWindow.webContents.send("loading", false);
    }

    setLoadingText(text) {
        this.startWindow.webContents.send("loading-text", text);
    }

    setQR(qrcode) {
        this.startWindow.webContents.send("qrcode", qrcode);
    }
}

module.exports = View;
