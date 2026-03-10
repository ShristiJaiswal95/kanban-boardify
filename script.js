let tasks = JSON.parse(localStorage.getItem("tasks")) || []

function save(){
localStorage.setItem("tasks",JSON.stringify(tasks))
}

function render(filteredTasks = tasks){

document.querySelectorAll(".task-container").forEach(c=>c.innerHTML="")

filteredTasks.forEach(task=>{

let overdue = task.deadline && new Date(task.deadline) < new Date() && task.status!="done"

let div=document.createElement("div")

div.className="task"

div.id=task.id

div.draggable=true

div.ondragstart=drag

div.innerHTML=`

<strong>${task.title}</strong>

<p>${task.description || ""}</p>

<span class="priority ${task.priority}">${task.priority}</span>

<br>

<small>Deadline: ${task.deadline || "None"}</small>

<br>

<button onclick="deleteTask(${task.id})">Delete</button>

`

document.querySelector(`#${task.status} .task-container`).appendChild(div)

})

updateChart()
updateProgress()
updateCalendar()

}

function addTask(){

let title=document.getElementById("title").value
let description=document.getElementById("description").value
let deadline=document.getElementById("deadline").value
let priority=document.getElementById("priority").value

if(!title) return

tasks.push({
id:Date.now(),
title,
description,
deadline,
priority,
status:"todo"
})

save()
render()
closeModal()

}

function deleteTask(id){

tasks=tasks.filter(t=>t.id!==id)

save()
render()

}

function searchTasks(){

let value=document.getElementById("search").value.toLowerCase()

let filtered=tasks.filter(t=>t.title.toLowerCase().includes(value))

render(filtered)

}

function allowDrop(e){e.preventDefault()}

function drag(e){e.dataTransfer.setData("text",e.target.id)}

function drop(e){

e.preventDefault()

let id=e.dataTransfer.getData("text")

let column=e.target.closest(".column").id

let task=tasks.find(t=>t.id==id)

task.status=column

save()

render()

}

function openModal(){
document.getElementById("taskModal").style.display="flex"
}

function closeModal(){
document.getElementById("taskModal").style.display="none"
}

function toggleTheme(){
document.body.classList.toggle("light")
}

let chart

function updateChart(){

let todo=tasks.filter(t=>t.status=="todo").length
let progress=tasks.filter(t=>t.status=="progress").length
let done=tasks.filter(t=>t.status=="done").length

let data=[todo,progress,done]

if(chart) chart.destroy()

chart=new Chart(document.getElementById("taskChart"),{

type:"pie",

data:{
labels:["Todo","In Progress","Done"],
datasets:[{
data,
backgroundColor:["#3b82f6","#f59e0b","#22c55e"]
}]
},

options:{
plugins:{
legend:{
labels:{
color:getComputedStyle(document.body).color
}
}
}
}

})

}

function updateProgress(){

let done=tasks.filter(t=>t.status=="done").length

let percent = tasks.length ? (done/tasks.length)*100 : 0

document.getElementById("progressFill").style.width=percent+"%"

}


/* CALENDAR */

let calendar

function initCalendar(){

let calendarEl=document.getElementById("calendar")

calendar=new FullCalendar.Calendar(calendarEl,{

initialView:"dayGridMonth",

height:650,

events:tasks.map(t=>({
title:t.title,
start:t.deadline
}))

})

calendar.render()

}

function updateCalendar(){

if(!calendar) return

calendar.removeAllEvents()

tasks.forEach(task=>{

if(task.deadline){

calendar.addEvent({
title:task.title,
start:task.deadline
})

}

})

}

function showCalendar(){

document.querySelector(".board").style.display="none"

document.getElementById("calendarView").style.display="block"

if(!calendar) initCalendar()

updateCalendar()

}

function showBoard(){

document.querySelector(".board").style.display="flex"

document.getElementById("calendarView").style.display="none"

}

render()