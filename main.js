let titleInput = document.querySelector(".todo-title");
let descriptionInput = document.querySelector(".todo-describe");
const addBtn = document.querySelector(".add-button");
const todoUlList = document.querySelector(".todo-list");
const myArrList = [];
let isEditing = false;
let currentEditingIndex = null;
let id = 0;
const searchInput = document.querySelector(".search-input");
searchInput.style.display = "none";

displaySavedItems();

function displaySavedItems() {
  const savedItems = localStorage.getItem("todoUlList");
  if (savedItems) {
    const parsedItems = JSON.parse(savedItems);
    myArrList.push(...parsedItems);

    if (parsedItems.length > 0) {
    id = Math.max(...parsedItems.map((item) => item.ID));
    }

    displayItems();
  }
}

function validateTitle() {
  const titleRe = /^[A-Z][a-z]{3,8}$/;
  let titleValue = titleInput.value;
  if (!titleValue.match(titleRe)) {
    alert(
      "The title must start with an uppercase letter (A-Z), followed by 3 to 8 lowercase letters (a-z)"
    );
    titleValue = "";
    return false;
  }
  return true;
}
function validateDescribe() {
  const describeRe = /^.{20,}$/;
  let describeValue = descriptionInput.value;
  if (!describeValue.match(describeRe)) {
    alert("The Description must be at least 20 character");
    describeValue = "";
    return false;
  }
  return true;
}

addBtn.addEventListener("click", addList);

function addList(event) {
  event.preventDefault();
  if (titleInput.value == "" || descriptionInput.value == "") {
    return;
  }
  const notValidateTitle = !validateTitle();
  const notValidateDescribe = !validateDescribe();

  if (notValidateTitle || notValidateDescribe) {
    return;
  }

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
      completed: false,
    };
    myArrList.push(missionObj);
  }

  titleInput.value = "";
  descriptionInput.value = "";
  saveTodoItems();

  displayItems();
}

function completeBtn(event) {
  let todoItem = event.target.parentElement;
  const itemIndex = todoItem.getAttribute("data-index");

  if (myArrList[itemIndex].completed) {
    myArrList[itemIndex].completed = false;
  } else {
    myArrList[itemIndex].completed = true;
  }
  saveTodoItems();
  displayItems();
}

function edit(event) {
  event.preventDefault();
  let todoItem = event.target.parentElement;
  const itemIndex = todoItem.getAttribute("data-index");
  let editingTitle = todoItem.querySelector(".span-item").innerText;
  titleInput.value = editingTitle;
  descriptionInput.value = myArrList[itemIndex].description;

  isEditing = true;
  currentEditingIndex = itemIndex;
  addBtn.innerText = "Update";
}

function saveTodoItems() {
  localStorage.setItem("todoUlList", JSON.stringify(myArrList));
}

function displayItems(filteredList = null) {
  todoUlList.innerHTML = "";
  if (myArrList.length > 2) {
    searchInput.style.display = "inline-block";
  }
  const listToDisplay = filteredList || myArrList;

  listToDisplay.forEach((item, index) => {
    const todoList = document.createElement("li");
    todoList.classList.add("todo-item");
    todoList.setAttribute("data-index", index);

    const spanItem = document.createElement("span");
    spanItem.classList.add("span-item");
    spanItem.innerText = item.title;
    spanItem.setAttribute("title-data", index);
    todoList.appendChild(spanItem);

    const deleteCheck = document.createElement("button");
    deleteCheck.classList.add("delete-btn", "fa-solid", "fa-trash");
    deleteCheck.addEventListener("click", function () {
      myArrList.splice(index, 1);
      saveTodoItems();
      displayItems();
    });
    console.log(myArrList.length)
    if (myArrList.length <= 2) {
      searchInput.style.display = "none";
    }
    todoList.appendChild(deleteCheck);

    const editCheck = document.createElement("button");
    editCheck.classList.add("edit-btn", "fa-solid", "fa-pencil");
    editCheck.addEventListener("click", edit);
    todoList.appendChild(editCheck);

    const completeCheck = document.createElement("button");
    completeCheck.classList.add(
      "check-btn",
      "fa-duotone",
      "fa-solid",
      "fa-check"
    );
    completeCheck.addEventListener("click", completeBtn);
    if (item.completed) {
      todoList.classList.toggle("green");
    }

    todoList.appendChild(completeCheck);
    todoUlList.appendChild(todoList);
  });
}
searchInput.addEventListener("input", () => {

  const term = searchInput.value.trim().toLowerCase();
  if (term == "") {
    return displayItems();
  } else {
    const filteredList = myArrList.filter((item) => {
      return item.title.toLowerCase().includes(term);
    });
    
 
    displayItems(filteredList);
  }
});
