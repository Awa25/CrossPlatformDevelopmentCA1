// Modules to control application life and create a native browser window.
// app module: controls the life of the app.
// BrowserWindow module: create and manage the app windows.
// Allows to include modules in app.
const electron = require('electron')

// For launching new Renderer processes by running app, browserWindow.
const { app, BrowserWindow } = electron

// Keep this window to create the application.
let mainWindow

// Start application to show index.html files.
app.on('ready', () => {
    // Create a window.
    mainWindow = new BrowserWindow({
        // Not allow the user to change the size of window.
        resizable: false,
        // Set width and height of windows. 
        width: 800,
        height: 600,
        webPreferences: {
            // Set to use API of node js in the page.
            nodeIntegration: true, 
            contextIsolation: false,
        }
    })
    // Load the main.html in window.
    mainWindow.loadURL(`file://${__dirname}/src/main.html`)

    // Don't show until we are ready and loaded.
    mainWindow.once('ready-to-show', mainWindow.show)

    // The mainWindow instance on close.
    mainWindow.on("closed", () => (mainWindow = null));
    
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
//app.whenReady().then(mainWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar to stay active 
    // until the user quits explicitly with Cmd + Q.
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// Activate: Various actions can trigger this event.
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})