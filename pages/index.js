const getAuthQRpage = require('./authQR');
const getMainPage = require('./main')

const authQRpage = getAuthQRpage();

authQRpage.onClientReady().then(client => {
    const mainPage = getMainPage(client);

    authQRpage.closeWindow();
})