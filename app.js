// 1. Select user interface elements
const todoInput = document.getElementById('todo-input'); 
const addBtn = document.getElementById('add-btn'); 
const todoList = document.getElementById('todo-list'); // Mapped correctly (singular)
const searchBtn = document.getElementById('search-btn');
const clearBtn = document.getElementById('clear-btn');

// 2. Load local storage list. Auto-converts old string arrays to our new object structure.
let rawTodos = JSON.parse(localStorage.getItem('todos')) || [];
let todos = rawTodos.map(item => {
    if (typeof item === 'string') {
        return { text: item, timeSpent: 0, isRunning: false };
    }
    return item;
});

// Real-time search filter state
let searchQuery = "";

// 3. Helper format function to convert total seconds into MM:SS format
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 4. Read and Display function
function displayTodos() {
    todoList.innerHTML = ''; 

    todos.forEach((todo, index) => {
        // If a search query is typed, skip any tasks that do not match the query
        if (searchQuery && !todo.text.toLowerCase().includes(searchQuery)) {
            return;
        }

        const li = document.createElement('li'); 

        // Create container holding text and the running stopwatch display
        const taskDetails = document.createElement('div');
        taskDetails.classList.add('task-details');

        const taskText = document.createElement('span');
        taskText.textContent = todo.text;
        taskText.classList.add('task-text');
        
        const timerDisplay = document.createElement('span');
        timerDisplay.textContent = `Time: ${formatTime(todo.timeSpent)}`;
        timerDisplay.classList.add('timer-display');

        taskDetails.appendChild(taskText);
        taskDetails.appendChild(timerDisplay);
        li.appendChild(taskDetails);

        // Controls container (Timer Button + Delete Button)
        const taskControls = document.createElement('div');
        taskControls.classList.add('task-controls');

        // Create the Start/Pause toggle button
        const timerBtn = document.createElement('button');
        timerBtn.classList.add('timer-btn');
        if (todo.isRunning) {
            timerBtn.textContent = 'Pause';
            timerBtn.classList.add('pause');
        } else {
            timerBtn.textContent = 'Start';
            timerBtn.classList.add('start');
        }
        timerBtn.onclick = () => toggleTimer(index);

        // Create the individual delete button
        const deleteBtn = document.createElement('button'); 
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = () => deleteTodo(index); // Fixed typo: changed "oneclick" to "onclick"

        taskControls.appendChild(timerBtn);
        taskControls.appendChild(deleteBtn);
        li.appendChild(taskControls);

        todoList.appendChild(li);
    }); 
}

// 5. Create a Task (stores details as objects)
function addTodo() {
    const taskText = todoInput.value.trim();
    
    if (taskText === '') return;

    todos.push({
        text: taskText,
        timeSpent: 0,
        isRunning: false
    });
    
    saveAndRender();
    todoInput.value = '';
}

// 6. Delete a single task
function deleteTodo(index) {
    todos.splice(index, 1);
    saveAndRender();
}

// 7. Toggle stopwatch state (Start/Pause)
function toggleTimer(index) {
    todos[index].isRunning = !todos[index].isRunning;
    saveAndRender();
}

// 8. Search implementation: filters screen tasks matching the input field text
searchBtn.onclick = () => {
    searchQuery = todoInput.value.trim().toLowerCase();
    displayTodos();
};

// 9. Clear All Tasks implementation
clearBtn.onclick = () => {
    if (confirm("Are you sure you want to clear all tasks? This resets your timers.")) {
        todos = [];
        saveAndRender();
    }
};

// Global background scheduler ticking every second to update running tasks
setInterval(() => {
    let activeTick = false;
    todos.forEach(todo => {
        if (todo.isRunning) {
            todo.timeSpent++;
            activeTick = true;
        }
    });
    // Only save and re-render if at least one timer is running
    if (activeTick) {
        localStorage.setItem('todos', JSON.stringify(todos));
        displayTodos();
    }
}, 1000);

// Helper function to update system memory and sync views
function saveAndRender() {
    localStorage.setItem('todos', JSON.stringify(todos));
    displayTodos();
}

// Bind Enter and Click events
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Run initial scan
displayTodos();




