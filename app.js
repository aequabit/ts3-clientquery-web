const {
    app,
    BrowserWindow
} = require('electron'),
    url = require('url'),
    telnet = require('telnet-client'),
    connection = new telnet();

let win;

connection.on('ready', function(prompt) {
    console.log('[telnet] connected successfully!')
});
connection.connect({
    host: '127.0.0.1',
    port: 25639,
    shellPrompt: '',
    execTimeout: 7500,
    sendTimeout: 7500
});

global.sendTsCmd = (command, args, callback) => {
    var final = command;
    args.forEach(arg => {
        final += ' ' + arg;
    });
    console.log('[telnet] command: %s', final);
    connection.exec(final, function(err, response) {
        if (err) return callback(1, err);
        callback(0, response);
    });
};

function createWindow() {
    win = new BrowserWindow({
        width: 400,
        height: 250,
        resizable: false
    });

    win.setMenu(null);

    win.loadURL(url.format({
        pathname: __dirname + '/ui/index.html',
        protocol: 'file:',
        slashes: true
    }));

    win.webContents.openDevTools()

    win.on('closed', () => {
        win = null
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
