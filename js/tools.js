module.exports = {
    getDefaultWallet: function (app) {
        var fs = require('fs');
        var appDir = app.getAppPath();
        var walletCheckFile = appDir + '/bin/defaultwallet';
        var walletId = null;
        var walletFile = null;
        var walletContent = null;
        var isWalletExists = false;
        if (fs.existsSync(walletCheckFile)) {
            walletId = fs.readFileSync(walletCheckFile);
            walletFile = appDir + '/bin/keydir/' + walletId + '.json';
            if (fs.existsSync(walletFile)) {
                walletContent = fs.readFileSync(walletFile);
                isWalletExists = true;
            }
        }

        return isWalletExists ? {wallet: walletId, content: walletContent} : null;
    }
};