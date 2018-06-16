const {app, BrowserWindow} = require('electron');

let mainWindow;

function createWindow() {
    var path = require('path')
    var tools = require('./js/tools');
    tools.createAllDirectories(app);
    var defaultAddress = tools.getDefaultWalletInfo(app);
    var isWalletExists = !!defaultAddress;
    mainWindow = new BrowserWindow({
        width: 1100,
        height: 800,
        icon: path.join(__dirname, 'icon.png')
    });
    if (isWalletExists) {
        tools.updateGlobalVars(app, mainWindow);
    }

    mainWindow.loadFile('web/index.html');
    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow);
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});
