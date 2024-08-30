// Initialize localStorage with an empty tasks array if not already set
function initializeTasks() {
    if (!localStorage.getItem('tasks')) {
        localStorage.setItem('tasks', JSON.stringify([]));
    }
}

initializeTasks();

// Display all tasks
function displayTasks() {
    const taskList = document.querySelector('#list-items');
    taskList.innerHTML = '';
    let count = 1;
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(task => {
        const status = task.completed ? 'checked' : '';
        const statusLine = status ? 'item-checked' : '';
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

// Generate a new unique ID for a task
function generatedId() {
    let newId = 0;
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(task => {
        newId = Math.max(newId, task.id);
    });
    return ++newId;
}

// Add a new task to localStorage and display tasks
function addTask(description) {
    const date = new Date();
    if (description !== '') {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const newTask = {
            "id": generatedId(),
            "description": description,
            "completed": false,
            "priority": "Medium",
            "dueDate": date.toLocaleDateString(),
        };
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
    }
}

// Delete a task from localStorage and update the display
function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

// Update the status of a task and refresh the display
function updateStatus(status, id) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = status;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

// Get tasks based on their completion status
function getItems(status) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    return tasks.filter(task => task.completed === status);
}

// Event listener for delete button
document.querySelector('#list-items').addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('delete-btn')) {
        const taskItem = e.target.closest('li');
        const id = taskItem.querySelector('#id').textContent;
        deleteTask(id);
    }
});

// Event listener for checkbox change
document.querySelector('#list-items').addEventListener('change', function (e) {
    if (e.target && e.target.classList.contains('check-item')) {
        const taskLi = e.target.parentElement.parentElement;  // li
        const id = taskLi.querySelector('#id').textContent;
        updateStatus(e.target.checked, id);
    }
});

// Event listener for add task button
document.querySelector('#add-task-btn').addEventListener('click', function (e) {
    e.preventDefault();
    const inputElement = document.querySelector('#task-title');
    addTask(inputElement.value);
    inputElement.value = '';
});

// Display completed tasks
document.querySelector('#completed-btn').addEventListener('click', function () {
    const completedTasks = getItems(true);
    displayCompleteIncompleteTasks(completedTasks);
});

// Display incomplete tasks
document.querySelector('#incomplete-btn').addEventListener('click', function () {
    const incompleteTasks = getItems(false);
    displayCompleteIncompleteTasks(incompleteTasks);
});

// Display all tasks
document.querySelector('#all-tasks').addEventListener('click', function () {
    displayTasks();
});

// Display tasks based on their completion status
function displayCompleteIncompleteTasks(list) {
    const taskList = document.querySelector('#list-items');
    taskList.innerHTML = '';
    let count = 1;
    list.forEach(task => {
        const status = task.completed ? 'checked' : '';
        const statusLine = status ? 'item-checked' : '';
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

// Initially display all tasks
displayTasks();
