// Main process, Renderer process
const { app, BrowserWindow } = require('electron')

// Create the browser window.
function createWindow () {
    const mainWindow = new BrowserWindow({
        width: 800,
        hieght: 600,
        show: false,
        frame: false
    })
    // Load the index.html file.
    mainWindow.loadFile('index.html')

    // Don't show until we are ready and loaded.
    mainWindow.once('ready-to-show', mainWindow.show)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow)

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