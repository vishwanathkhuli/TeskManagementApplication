// let tasks = []; //It will store the all the tasks 
let completedTasks = []; // It will store only the completed tasks
let incompleteTasks = []; // It will store the tasks which are not completed

// It will fetch the tasks
async function fetchData() {
    try {
        const response = await fetch('tasks.json');
        const data = await response.json();
        tasks = data;
        displayTasks(tasks);
    }
    catch (err) {
        console.log('Err while fetching the tasks : ', err);
    }
}

// It will display the tasks 
function displayTasks() {
    const taskList = document.querySelector('#list-items');
    taskList.innerHTML = '';
    let count = 1;
    for (let id in localStorage) {
        if (localStorage.hasOwnProperty(id)) {
            let task = JSON.parse(localStorage.getItem(id));
            const status = (task.completed) ? 'checked' : '';
            const statusLine = (status) ? 'item-checked' : '';
            const listElement = `
            <li class="${statusLine}">
                <span id="id" style="display:none">${task.id}</span>
                <span class="task-description" title="Task Description">${count++}. ${task.description}</span>
                <div class="actions">
                    <input type="checkbox" class="check-item" ${status} title="Complete Task">
                    <button class="delete-btn">Delete <i class="fa-solid fa-trash" title="Delete Task"></i></button>
                </div>
             </li>`;

            taskList.insertAdjacentHTML('beforeend', listElement);
        }
    }
}

//It will dipslay the completed or incompleted tasks 
function displayCompleteIncompleteTasks(list) {
    const taskList = document.querySelector('#list-items');
    taskList.innerHTML = '';
    let count = 1;
    list.forEach((task) => {
        const status = (task.completed) ? 'checked' : '';
        const statusLine = (status) ? 'item-checked' : '';
        const listElement = `
            <li class="${statusLine}">
                <span id="id" style="display:none">${task.id}</span>
                <span class="task-description" title="Task Description">${count++}. ${task.description}</span>
                <div class="actions">
                    <input type="checkbox" class="check-item" ${status} title="Complete Task">
                    <button class="delete-btn">Delete <i class="fa-solid fa-trash" title="Delete Task"></i></button>
                </div>
             </li>`;

        taskList.insertAdjacentHTML('beforeend', listElement);
    });
}

function generatedId() {
    let newId = 0;
    if (localStorage.length != 0) {
        Object.keys(localStorage).forEach((key) => {
            const item = JSON.parse(localStorage.getItem(key));
            if (item && item.id) {
                newId = Math.max(newId, item.id);
            }
        })
    }
    return ++newId;
}

// It will hepls to add the new task
function addTask(description) {
    const date = new Date();
    if (description !== '') {
        const newTask = {
            "id": generatedId(),
            "description": description,
            "completed": false,
            "priority": "Medium",
            "dueDate": date.toLocaleDateString(),
        }
        localStorage.setItem(newTask.id, JSON.stringify(newTask));
    }
    displayTasks(localStorage);
}

// It will delete the item from the main tasks with using id
function deleteTask(id) {
    localStorage.removeItem(id);
    displayTasks(localStorage);
}

// It will update the status of the task from the tasks using
function updateStatus(status, id) {
    const task = JSON.parse(localStorage.getItem(id));
    task.completed = status;
    localStorage.setItem(task.id, JSON.stringify(task));
    displayTasks(localStorage);
}

//get items 
function getItems(status) {
    let result = [];
    for (let id in localStorage) {
        if (localStorage.hasOwnProperty(id)) {
            const task = JSON.parse(localStorage.getItem(id));
            if (task.completed == status) {
                result.push(task);
            }
        }
    }
    return result;
}

// Delete Button
document.querySelector('#list-items').addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('delete-btn')) {
        const taskItem = e.target.closest('li'); // Get the parent <li> element
        const id = taskItem.querySelector('#id').textContent;
        console.log(id);
        deleteTask(id);
        taskItem.remove();
    }
});

// Check item or change the status of the item button 
document.querySelector('#list-items').addEventListener('change', function (e) {
    if (e.target && e.target.classList.contains('check-item')) {
        const taskLi = e.target.parentElement.parentElement;  // li
        const id = taskLi.querySelector('#id').textContent;
        const taskDescription = taskLi.querySelector('.task-description');
        taskDescription.classList.toggle('item-checked');
        updateStatus(e.target.checked, id);
        // displayTasks(tasks);
    }
})

// Add a new task button 
document.querySelector('#add-task-btn').addEventListener('click', function (e) {
    e.preventDefault();
    const inputElement = document.querySelector('#task-title');
    addTask(inputElement.value);
    inputElement.value = '';
});

//Completed button display all the completed tasks 
document.querySelector('#completed-btn').addEventListener('click', function (e) {
    const status = true;
    completedTasks = getItems(status);
    displayCompleteIncompleteTasks(completedTasks);
});

//Incomplete button display all the incomplete tasks
document.querySelector('#incomplete-btn').addEventListener('click', function (e) {
    const status = false;
    incompleteTasks = getItems(status);
    displayCompleteIncompleteTasks(incompleteTasks);
});

//It will display all the tasks 
document.querySelector('#all-tasks').addEventListener('click', function (e) {
    displayTasks(localStorage);
});

//Initially fetch the data
// fetchData();
displayTasks(localStorage);