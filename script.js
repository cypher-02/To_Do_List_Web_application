let taskData = {
    index: 1,
    task : {},
    done : []
};

const taskInput = document.querySelector('.taskInput');
const taskAddButton = document.querySelector('.taskAdd');
const taskList = document.querySelector('.taskList');
const deleteAllButton = document.getElementById('deleteAll');
const deleteSelected = document.getElementById('deleteSelected');
const doneSelected = document.getElementById('doneSelected');
let currentTask = null;
const selectedTask = new Set();

function createTaskElement(index, taskText) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');

    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.value = index;

    const p = document.createElement('p');
    p.textContent = taskText;

    const doneIcon = document.createElement('i');
    doneIcon.classList.add('fa-solid', 'fa-check', 'doneTask');

    const editIcon = document.createElement('i');
    editIcon.classList.add('fa-solid', 'fa-pencil', 'editTask');

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa-solid', 'fa-trash', 'deleteTask');

    taskDiv.append(checkBox, p, doneIcon, editIcon, deleteIcon);

    taskData.task[index] = taskText;

    return taskDiv;
}

function addTask() {
    let index = taskData.index++;
    const taskText = taskInput.value.trim();

    if (!taskText)
        return alert('Please enter a task!');

    taskInput.value = '';
    const task = createTaskElement(index, taskText);
    taskList.appendChild(task);

    localStorage.setItem('task', JSON.stringify(taskData));
}

taskAddButton.addEventListener('click', () => {
    if (taskAddButton.textContent === 'Add Task') {
        addTask();
    } else {
        updateTask();
    }
});

function handleTaskAction(event) {
    const target = event.target;
    const taskDiv = target.closest('.task');
    if (!taskDiv)
		 return;

    const taskText = taskDiv.querySelector('p');
    const checkBox = taskDiv.querySelector('input');
    const index = checkBox.value;

    if (target.classList.contains('doneTask')) {
        if (taskData.done.includes(index)) {
            taskText.style.textDecoration = 'none';
            let i = taskData.done.indexOf(index);
            taskData.done.splice(i, 1);
        } else {
            taskText.style.textDecoration = 'line-through';
            taskData.done.push(index);
        }
        localStorage.setItem('task', JSON.stringify(taskData));
    } else if (target.classList.contains('editTask')) {
        currentTask = taskText;
        taskInput.value = taskText.textContent;
        taskAddButton.textContent = 'Update Task';
    } else if (target.classList.contains('deleteTask')) {
        if (taskData.done.includes(index)) {
            let i = taskData.done.indexOf(index);
            taskData.done.splice(i, 1);
        }
        delete taskData.task[index];
        localStorage.setItem('task', JSON.stringify(taskData));
        taskDiv.remove();
    } else if (target.type == 'checkbox') {
        if (target.checked) {
            selectedTask.add(taskDiv);
        } else {
            selectedTask.delete(taskDiv);
        }
    } 
}


function updateTask() {
    if (currentTask) {
        currentTask.textContent = taskInput.value.trim();
        taskAddButton.textContent = 'Add Task';
        taskInput.value = '';

        const checkBox = currentTask.previousElementSibling;
        const index = checkBox.value;
        taskData.task[index] = currentTask.textContent;

        currentTask = null;
        localStorage.setItem('task', JSON.stringify(taskData));
    }
}

taskList.addEventListener('click', handleTaskAction);

deleteAllButton.addEventListener('click', function() {
    taskList.innerHTML = '';
    taskData = {
        index: 1,
        task : {},
        done : []
    };
    localStorage.removeItem('task');
});

deleteSelected.addEventListener('click', function () {
    selectedTask.forEach(taskDiv => {
        const checkBox = taskDiv.querySelector('input');
        const index = checkBox.value;

        delete taskData.task[index];

        const doneIndex = taskData.done.indexOf(index);
        if (doneIndex !== -1) {
            taskData.done.splice(doneIndex, 1);
        }
        taskDiv.remove();
    });
    selectedTask.clear();

    localStorage.setItem('task', JSON.stringify(taskData));
    let obj = JSON.parse(localStorage.getItem('task'))
    console.log(obj);
});
doneSelected.addEventListener('click', function () {
    selectedTask.forEach(taskDiv => {
        const checkBox = taskDiv.querySelector('input');
        const index = checkBox.value;
        const taskText = taskDiv.querySelector('p');
        
        if (!taskData.done.includes(index)) {
            taskData.done.push(index);
            taskText.style.textDecoration = 'line-through';
        }
    });
    selectedTask.clear();

    localStorage.setItem('task', JSON.stringify(taskData));
});


function myfun(){
    let todoObj = JSON.parse(localStorage.getItem('task'));
    if(todoObj != null){
        taskData = todoObj;
        let {task,done} = taskData;
        let allTaskArray = Object.entries(task);
        allTaskArray.forEach(function(arr){
            let task = createTaskElement(arr[0],arr[1]);
            if(done.includes(arr[0])){
                let taskText = task.children[1];
                taskText.style.textDecoration = 'line-through';
            }
            taskList.appendChild(task);
        });
    }
}