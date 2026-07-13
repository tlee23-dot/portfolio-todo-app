
//1. do stuff with the  buttons and the input field 

const todoInput = document.getElementById('todo-input'); 
const addBtn = document.getElementById('add-btn'); 
const todoList = document.getElementById('todo-list'); 

//2. load local storage if any 
let todos = JSON.parse(localStorage.getItem('todos')) || [];



//3. Read and display the todos from local storage
function displayTodos() {
    //clear the list for no duplicates 
    todoList.innerHTML = ''; 


    //now go into the todo array, loop 
    todos.forEach((todo, index) => {

        //create a list item 
        const li = document.createElement('li'); 

        //add a task text 
        const taskText = document.createElement('span');
        taskText.textContent = todo;
        li.appendChild(taskText);

        //create a delete button
        const deleteBtn = document.createElement('button'); 
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');

        //tie the specific item to the delete action 
        deleteBtn.oneclick = () => deleteTodo(index); 

        //list too 
        li.appendChild(deleteBtn);
        todoList.appendChild(li);

    }); 

}


//4. create to grab the text field value  and add to the list 
function addTodo() {
    const taskText = todoInput.value.trim();
    
    // Safety check: Don't let users add completely blank tasks
    if (taskText === '') {
        return;
    }

    todos.push(taskText);
    saveAndRender();
    
    // Clear out the text field so the user can type the next item immediately
    todoInput.value = '';
}

// 5. DELETE: Function to remove an item from the array using its position index
function deleteTodo(index) {
    // splice removes exactly 1 element at the given index position
    todos.splice(index, 1);
    saveAndRender();
}

// Helper function to update the browser storage and refresh the layout at the same time
function saveAndRender() {
    localStorage.setItem('todos', JSON.stringify(todos));
    displayTodos();
}

// 6. Listen for events (clicks and keystrokes)
addBtn.addEventListener('click', addTodo);

// Let the user press the physical "Enter" key inside the text box instead of clicking the button
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Run this function once immediately when the webpage loads up to reveal past saved tasks
displayTodos();




