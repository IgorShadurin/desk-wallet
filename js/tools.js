module.exports = {
    getDefaultAddress: function (app) {
        var fs = require('fs');
        var appDir = app.getAppPath();
        var walletCheckFile = appDir + '/bin/defaultwallet';
        var walletId = null;
        var walletFile = null;
        var isWalletExists = false;
        if (fs.existsSync(walletCheckFile)) {
            walletId = fs.readFileSync(walletCheckFile);
            walletFile = appDir + '/bin/keydir/' + walletId + '.json';
            if (fs.existsSync(walletFile)) {
                isWalletExists = true;
            }
        }

        return isWalletExists ? walletId : null;
    }
};