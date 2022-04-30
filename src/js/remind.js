const electron = require('electron')
const { ipcRenderer } = electron

// Set background of tray window.
const imgs = [
    'background_1.jfif',
    'background_2.png',
    'background_3.jpg',
    'background_4.jfif',
    'background_5.jfif',
]

// Set the random background of tray window.
const randomIndex = parseInt(Math.random() * 5)
document.querySelector('.background').setAttribute('src', `./img/${imgs[randomIndex]}`)

ipcRenderer.on('setTask', (event, task) => {
    document.querySelector('.reminder').innerHTML =
        `<span>${decodeURIComponent(task)}</span>&nbsp;&nbsp;Time's up!`
})

const closeDom = document.querySelector('.close')
closeDom.addEventListener('click', () => {
    ipcRenderer.send('remindWindow:close')
})