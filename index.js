// Modules to control application life and create a native browser window.
// app module: controls the life of the app.
// BrowserWindow module: create and manage the app windows.
// Allows to include modules in app.
const electron = require('electron')

// Path module
const path = require('path')

// For launching new Renderer processes by running app, browserWindow.
const { app, BrowserWindow, ipcMain, Menu, Tray, screen } = electron

// System tray icon.
const iconPath = path.join(__dirname, './src/img/iconTemplate.png') 

// Keep this window to create the application.
let mainWindow
let tray
let remindWindow

// Start application to show index.html files.
app.on('ready', () => {
    // Create a window.
    mainWindow = new BrowserWindow({
        // Not allow the user to change the size of window.
        resizable: false,
        // Set width and height of windows. 
        width: 800,
        height: 600,
        icon: iconPath,
        webPreferences: {
            backgroundThrottling: false,
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

    // Create Tray.
    tray = new Tray(iconPath);
    // Tips when the mouse is over the system tray icon.
    tray.setToolTip('TaskManager');
    // Click event handler
    tray.on('click', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide()
        }
        else {
            mainWindow.show()
        }
    })
    // Define the right menu.
    tray.on('right-click', () => {
        const menuConfig = Menu.buildFromTemplate([
            {
                label: 'Quit',
                click: () => app.quit()
            }
        ])
        tray.popUpContextMenu(menuConfig)
    })
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





ipcMain.on('mainWindow:close', () => {
    mainWindow.hide()
})

ipcMain.on('remindWindow:close', () => {
    remindWindow.close()
})

ipcMain.on('setTaskTimer', (event, time, task) => {
    const now = new Date()
    const date = new Date()
    date.setHours(time.slice(0, 2), time.slice(3), 0)
    const timeout = date.getTime() - now.getTime()
    setTimeout(() => {
        createRemindWindow(task)
    }, timeout)
})

function createRemindWindow(task) {
    if (remindWindow) remindWindow.close()
    remindWindow = new BrowserWindow({
        height: 200,
        width: 360,
        resizable: false,
        //frame: false,
        icon: iconPath,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    remindWindow.removeMenu()
    // The bounds, size, and position of tray icon.
    const size = screen.getPrimaryDisplay().workAreaSize
    const { y } = tray.getBounds()
    const { height, width } = remindWindow.getBounds()
    const yPosition = process.platform === 'darwin' ? y : y - height
    remindWindow.setBounds({
        x: size.width - width,
        y: yPosition,
        height,
        width
    })
    remindWindow.setAlwaysOnTop(true)
    remindWindow.loadURL(`file://${__dirname}/src/remind.html`)
    remindWindow.show()
    // Use the webContents API to send data to the browser window to display content.
    remindWindow.webContents.send('setTask', task)
    remindWindow.on('closed', () => { remindWindow = null })
    // Set timer to close the tray.
    setTimeout(() => {
        remindWindow && remindWindow.close()
    }, 50 * 1000)
}