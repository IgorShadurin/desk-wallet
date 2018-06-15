module.exports = {
    getDefaultWalletInfo: function (app) {
        var fs = require('fs');
        var appDir = app.getAppPath();
        var walletCheckFile = appDir + '/bin/defaultwallet';
        var walletId = null;
        var walletFile = null;
        var walletContent = null;
        var isWalletExists = false;
        if (fs.existsSync(walletCheckFile)) {
            console.log(walletCheckFile);

            walletId = fs.readFileSync(walletCheckFile).toString();
            console.log(walletId);

            if (!walletId) {
                console.error('Default wallet is empty');
                return null;
            }

            walletFile = appDir + '/bin/keydir/' + walletId + '.json';
            console.log(walletFile);

            if (fs.existsSync(walletFile)) {
                walletContent = fs.readFileSync(walletFile);
                console.log(walletContent);

                isWalletExists = true;
            }
        }

        return isWalletExists ? {wallet: walletId, content: walletContent} : null;
    },

    getWalletsList: function (app) {
        var defaultWallet = this.getDefaultWalletInfo(app);
        console.log(defaultWallet);
        var fs = require('fs');
        var appDir = app.getAppPath();
        var path = require('path');
        var walletsDir = appDir + '/bin/keydir';
        var files = {};
        fs.readdirSync(walletsDir).forEach(function (file) {
            var name = path.basename(file, '.json');
            var isDefault = name == defaultWallet.wallet;
            files[name] = {
                path: walletsDir + "/" + file,
                isDefault: isDefault
            };
        });

        return files;
    },

    setDefaultWallet: function (app, address) {
        var fs = require('fs');
        var filename = app.getAppPath() + "/bin/defaultwallet";
        console.log(address);
        fs.writeFileSync(filename, address);
    },

    updateGlobalVars: function (app, window) {
        var defaultAddress = this.getDefaultWalletInfo(app);

        window.webContents.executeJavaScript("localStorage.setItem('global', JSON.stringify({wallets: " + JSON.stringify(this.getWalletsList(app)) + ", wallet:{ address: '" + defaultAddress.wallet + "', content: '" + defaultAddress.content + "' }}))").then(function (value) {
            return value;
        });
    }
};