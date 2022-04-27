const electron = require('electron')

// Specified and get document.
const tabManage = document.querySelectorAll('.tab-manage')
const contentManage = document.querySelectorAll('.content-manage')
const taskTodo = document.querySelector('.task-todo')
const taskFinished = document.querySelector('.task-finished')
const taskDeleted = document.querySelector('.task-deleted')
const keepTimesDom = document.querySelector('.keep-times')
const date = new Date(), nowTime = date.getTime()


/** task data structure
* name, time, date
**/

// LocalStorage.
let loginTime = localStorage.getItem('loginTime')
let tasksTodo = localStorage.getItem('tasksTodo')
let tasksFinished = localStorage.getItem('tasksFinished')
let tasksDeleted = localStorage.getItem('tasksDeleted')
let keepTimes = localStorage.getItem('keepTimes')

tasksTodo = tasksTodo ? JSON.parse(tasksTodo) : []
tasksFinished = tasksFinished ? JSON.parse(tasksFinished) : []
tasksDeleted = tasksDeleted ? JSON.parse(tasksDeleted) : []
keepTimes = keepTimes ? keepTimes : 0

// Determine the last login time, if it is today, then the task, otherwise clear.
if (!loginTime) {
    loginTime = nowTime
} 
else {
    const loginD = new Date(loginTime).getTime()
    if (date.getDate() !== loginD.getDate() || nowTime - loginTime >= 24 * 3600 * 1000) {
        tasksFinished = []
        tasksTodo = []
        tasksDeleted = []
        localStorage.setItem('tasksFinished', JSON.stringify(tasksFinished))
        localStorage.setItem('tasksTodo', JSON.stringify(tasksTodo))
        localStorage.setItem('tasksDeleted', JSON.stringify(tasksDeleted))
    }
}

// Initialization Date.
document.querySelector('.date').innerText = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
genTodo()
genFinished()
genDeleted()

// Event handler.
tabManage.forEach((el, index) => {
    el.addEventListener('click', () => {
        activeTab(index)
        activeContent(index)
    })
})

// To do list event handler
// when click done the files move to the done page
// when click delete the files move to the trash page.
taskTodo.addEventListener('click', (event) => {
    const target = event.target
    const index = target.getAttribute("data-index")
    if (target.classList.contains('finish')) {
        keepTimes = +keepTimes + 1
        tasksFinished.push(tasksTodo[index])
        tasksTodo.splice(index, 1)
        localStorage.setItem('tasksTodo', JSON.stringify(tasksTodo))
        localStorage.setItem('tasksFinished', JSON.stringify(tasksFinished))
        localStorage.setItem('keepTimes', keepTimes)
        genFinished()
        genTodo()
        activeTab(1)
        activeContent(1)
    }
    else if (target.classList.contains('delete')) {
        keepTimes = +keepTimes + 1
        tasksDeleted.push(tasksTodo[index])
        tasksTodo.splice(index, 1)
        localStorage.setItem('tasksTodo', JSON.stringify(tasksTodo))
        localStorage.setItem('tasksDeleted', JSON.stringify(tasksDeleted))
        localStorage.setItem('keepTimes', keepTimes)
        activeTab(0)
        activeContent(0)
        genTodo()
        genDeleted()
    }
})