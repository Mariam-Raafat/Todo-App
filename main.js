let titleInput = document.querySelector(".todo-title");
let descriptionInput = document.querySelector(".todo-describe");
const addBtn = document.querySelector(".add-button");
const todoUlList = document.querySelector(".todo-list");
const myArrList = [];
let isEditing = false;
let currentEditingIndex = null;
let id = 0;
const searchInput = document.querySelector(".search-input");

displaySavedItems();

function displaySavedItems() {
    const savedItems = localStorage.getItem('todoUlList');
    if (savedItems) {
        const parsedItems = JSON.parse(savedItems);
        myArrList.length = 0;
        myArrList.push(...parsedItems);

        if (parsedItems.length > 0) {
            id = Math.max(...parsedItems.map(item => item.ID));
        }
        
        displayItems();
    }
}

addBtn.addEventListener("click", addList);
function addList(event) {
    event.preventDefault();
    
    if (!titleInput.value.trim()) return;
    
    if (isEditing) {
        myArrList[currentEditingIndex].title = titleInput.value;
        myArrList[currentEditingIndex].description = descriptionInput.value;
        isEditing = false;
        currentEditingIndex = null;
        addBtn.innerText = "Add";
    } else {
        id++;
        const missionObj = {
            title: titleInput.value,
            description: descriptionInput.value,
            ID: id,
        };
        myArrList.push(missionObj);
    }
    
   
    titleInput.value = "";
    descriptionInput.value = "";
    saveTodoItems();
    displayItems();
}

function completeBtn(event) {
    event.target.parentElement.classList.toggle('green');
}

function edit(event) {
    event.preventDefault();
    let todoItem = event.target.parentElement;
    const itemIndex = todoItem.getAttribute('data-index');
    let editingTitle = todoItem.querySelector(".span-item").innerText;
    titleInput.value = editingTitle;
    descriptionInput.value = myArrList[itemIndex].description;

    isEditing = true;
    currentEditingIndex = itemIndex;
    addBtn.innerText = "Update";
}

function saveTodoItems() {
    localStorage.setItem('todoUlList', JSON.stringify(myArrList));
}

function displayItems(filteredList = null) {
    todoUlList.innerHTML = '';
    

    const listToDisplay = filteredList || myArrList;

    listToDisplay.forEach((item, index) => {
        const todoList = document.createElement('li');
        todoList.classList.add('todo-item');
        todoList.setAttribute('data-index', index);

        const spanItem = document.createElement('span');
        spanItem.classList.add('span-item');
        spanItem.innerText = item.title;
        todoList.appendChild(spanItem);

        const deleteCheck = document.createElement('button');
        deleteCheck.classList.add('delete-btn');
        deleteCheck.innerText = "Delete";
        deleteCheck.addEventListener("click", function() {
            myArrList.splice(index, 1);
            saveTodoItems();
            displayItems();
           
        });
        todoList.appendChild(deleteCheck);

        const editCheck = document.createElement('button');
        editCheck.classList.add('edit-btn');
        editCheck.innerText = "Edit";
        editCheck.addEventListener("click", edit);
        todoList.appendChild(editCheck);

        const completeCheck = document.createElement('button');
        completeCheck.classList.add('check-btn');
        completeCheck.innerText = "Complete";
        completeCheck.addEventListener("click", completeBtn);
        todoList.appendChild(completeCheck);

        todoUlList.appendChild(todoList);
    });

    searchInput.addEventListener("input", () => {
        const term = searchInput.value.trim().toLowerCase();
        const filtered = myArrList.filter(item =>
            item.title.toLowerCase().includes(term)
        );
        displayItems(filtered);
    });
}


