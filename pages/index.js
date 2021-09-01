const getAuthQRpage = require('./authQR');


const authQRpage = getAuthQRpage();

authQRpage.onClientReady((client, view) => {
    console.log('client');
});