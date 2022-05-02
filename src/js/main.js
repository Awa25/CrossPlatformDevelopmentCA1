const electron = require('electron')
const { ipcRenderer } = electron

// Specified and get document.
const tabManage = document.querySelectorAll('.tab-manage')
const contentManage = document.querySelectorAll('.content-manage')
const taskTodo = document.querySelector('.task-todo')
const taskFinished = document.querySelector('.task-finished')
const taskDeleted = document.querySelector('.task-deleted')
const keepTimesDom = document.querySelector('.keep-times')
const date = new Date(), nowTime = date.getTime()
const closeDom = document.querySelector('.close')


/** task data structure
* name, time, date
**/

// LocalStorage - get value.
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

    // LocalStorage - save value.
    // JSON.stringify - convert data to string.
    localStorage.setItem('tasksFinished', JSON.stringify(tasksFinished))
    localStorage.setItem('tasksTodo', JSON.stringify(tasksTodo))
    localStorage.setItem('tasksDeleted', JSON.stringify(tasksDeleted))
  }
}

// Initialization Date.
document.querySelector('.date').innerText = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
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

taskDeleted.addEventListener('click', (taskRemoved) => {
  const target = taskRemoved.target
  const index = target.getAttribute("remove-index")
  if(target.classList.contains('removed')){
    if(confirm('Are You Sure?')){
      tasksDeleted.splice(index, 1)
      //localStorage.setItem('tasksDeleted', JSON.stringify(tasksDeleted))
      localStorage.clear()
    }
  }
})

// Navigation active.
function activeTab(index) {
  tabManage.forEach((tabEl) => {
    tabEl.classList.remove('nav-active')
  })
  tabManage[index].classList.add('nav-active')
}

// Content active.
function activeContent(index) {
  contentManage.forEach((taskEl) => {
    taskEl.classList.remove('content-active')
  })
  contentManage[index].classList.add('content-active')
  taskName.value = ''
  taskDate.value = ''
  taskTime.value = ''
}

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
    //keepTimes = +keepTimes + 1
    tasksDeleted.push(tasksTodo[index])
    tasksTodo.splice(index, 1)
    localStorage.setItem('tasksTodo', JSON.stringify(tasksTodo))
    localStorage.setItem('tasksDeleted', JSON.stringify(tasksDeleted))
    //localStorage.setItem('keepTimes', keepTimes)
    activeTab(0)
    activeContent(0)
    genTodo()
    genDeleted()
  }
})

// Create New Task
const taskName = document.querySelector('#taskName')
const taskDate = document.querySelector('#taskDate')
const taskTime = document.querySelector('#taskTime')
document.querySelector('.submit-task').addEventListener('click', () => {
  const name = taskName.value, taskdate = taskDate.value, time = taskTime.value;
  tasksTodo.push({
    name: name,
    date: taskdate,
    time: time
  });
  localStorage.setItem('tasksTodo', JSON.stringify(tasksTodo));
  if (!!time) ipcRenderer.send('setTaskTimer', time, taskdate, encodeURIComponent(name));
  genTodo();
  activeTab(0);
  activeContent(0);
});

// Set To Do list
function genTodo() {
  let todoHtml = ''
  tasksTodo.forEach((item, index) => {
    todoHtml +=
      `<div class="task-item">
          <div>
            <span class="task-text">${item.name}</span>
            <p class="task-text2">Due: ${item.date}&nbsp;&nbsp;&nbsp; at ${item.time}</p>
          </div>
          <div class="btnBox-line">
            <span class="btns finish enable-click" data-index="${index}">Done</span>
            <span class="btns delete enable-click" data-index="${index}">Delete</span>
          </div>
        </div>`
  })
  taskTodo.innerHTML = todoHtml
}

// Set Completed task list
function genFinished() {
  let finishHtml = ''
  tasksFinished.forEach((item) => {
    finishHtml +=
      `<div class="task-item">
        <div>
          <span class="task-text">${item.name}</span>
          <p class="task-text2">Due: ${item.date}&nbsp;&nbsp;&nbsp; at ${item.time}</p>
        </div>
        <div>
          <span class="flag-icon"></span>
        </div>
      </div>`
  })
  taskFinished.innerHTML = finishHtml
  keepTimesDom.innerHTML = keepTimes
}

// Set Deleted task list
function genDeleted() {
  let deleteHtml = ''
  tasksDeleted.forEach((item, index) => {
    deleteHtml +=
      `<div class="task-item">
        <div>
          <span class="task-text">${item.name}</span>
          <p class="task-text2">Due: ${item.date}&nbsp;&nbsp;&nbsp; at ${item.time}</p>
        </div>
        <div>
          <span class="btns removed remove-index="${index}" enable-click">Remove</span>
        </div>
      </div>`
  })
  taskDeleted.innerHTML = deleteHtml
  //keepTimesDom.innerHTML = keepTimes
}

closeDom.addEventListener('click', () => {
  ipcRenderer.send('mainWindow:close')
})
