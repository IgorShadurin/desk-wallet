module.exports = {
    createAllDirectories: function (app) {
        var fs = require('fs');
        var appDir = app.getAppPath();

        if (!fs.existsSync(appDir + '/bin')) {
            fs.mkdirSync(appDir + '/bin');
        }

        if (!fs.existsSync(appDir + '/bin/keydir')) {
            fs.mkdirSync(appDir + '/bin/keydir');
        }
    },

    getDefaultWalletInfo: function (app) {
        var fs = require('fs');
        var appDir = app.getAppPath();
        var walletCheckFile = appDir + '/bin/defaultwallet';
        var walletId = null;
        var walletFile = null;
        var walletContent = null;
        var isWalletExists = false;
        if (fs.existsSync(walletCheckFile)) {
            walletId = fs.readFileSync(walletCheckFile).toString();

            if (!walletId) {
                console.error('Default wallet is empty');
                return null;
            }

            walletFile = appDir + '/bin/keydir/' + walletId + '.json';
            if (fs.existsSync(walletFile)) {
                walletContent = fs.readFileSync(walletFile);
                isWalletExists = true;
            }
        }

        return isWalletExists ? {wallet: walletId, content: walletContent} : null;
    },

    saveWallet: function (content, address, onComplete) {
        var fs = require('fs');
        fs.writeFile(appDir + "/bin/keydir/" + address + '.json', content, onComplete);
    },

    getWalletsList: function (app) {
        var defaultWallet = this.getDefaultWalletInfo(app);
        var fs = require('fs');
        var appDir = app.getAppPath();
        var path = require('path');
        var walletsDir = appDir + '/bin/keydir';
        var files = [];
        fs.readdirSync(walletsDir).forEach(function (file) {
            var name = path.basename(file, '.json');
            var isDefault = name == defaultWallet.wallet;
            files.push({
                wallet: name,
                path: walletsDir + "/" + file,
                isDefault: isDefault
            });
        });

        return files;
    },

    setDefaultWallet: function (app, address) {
        var fs = require('fs');
        var filename = app.getAppPath() + "/bin/defaultwallet";
        console.log(address);
        fs.writeFileSync(filename, address);
    },

    getNodes: function (app) {
        var fs = require('fs');
        var filename = app.getAppPath() + "/nodes";
        var nodes = [];
        var result = [];
        if (fs.existsSync(filename)) {
            nodes = fs.readFileSync(filename).toString();
            if (nodes) {
                nodes = JSON.parse(nodes);
                nodes.forEach(function (v, i, a) {
                    if (v) {
                        result.push(v);
                    }
                });

                nodes = result;
            }
        }

        nodes = nodes ? nodes : [];

        return nodes;
    },

    addNode: function (app, url, name, chainId) {
        if (url && name && chainId) {
        } else {
            return false;
        }

        var fs = require('fs');
        var filename = app.getAppPath() + "/nodes";
        var nodes = this.getNodes(app);
        nodes.push({
            url: url,
            name: name,
            chainId: chainId
        });
        fs.writeFileSync(filename, JSON.stringify(nodes));

        return true;
    },

    removeNode: function (app, node) {
        if (!node) {
            return;
        }

        var fs = require('fs');
        var filename = app.getAppPath() + "/nodes";
        var nodes = this.getNodes(app);
        nodes.forEach(function (v, i, a) {
            if (v.url === node) {
                delete a[i];
            }
        });

        //console.log(nodes);
        var count = 0;
        nodes.forEach(function (v, i, a) {
            if (v) {
                count++;
            }
        });
        if (!count) {
            nodes = [];
        }
        //console.log(nodes);

        fs.writeFileSync(filename, JSON.stringify(nodes));
    },

    updateGlobalVars: function (app, window) {
        var defaultAddress = this.getDefaultWalletInfo(app);

        window.webContents.executeJavaScript("localStorage.setItem('global', JSON.stringify({nodes: " + JSON.stringify(this.getNodes(app)) + ", wallets: " + JSON.stringify(this.getWalletsList(app)) + ", wallet:{ address: '" + defaultAddress.wallet + "', content: '" + defaultAddress.content + "' }}))").then(function (value) {
            return value;
        });
    }
};