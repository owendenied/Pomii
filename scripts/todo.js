// Getting all required elements
const inputField = document.querySelector(".input-field textarea"),
  addBtn = document.querySelector(".input-field .add-button"),
  todoLists = document.querySelector(".todoLists"),
  pendingNum = document.querySelector(".pending-num"),
  clearButton = document.querySelector(".clear-button");

// Function to update the pending tasks count
function updatePendingTasksCount() {
  const tasks = document.querySelectorAll(".pending");
  pendingNum.textContent = tasks.length === 0 ? "no" : tasks.length;
}

// Function to save tasks to local storage
function saveTasks() {
  // Get all task items
  const tasks = todoLists.querySelectorAll("li");
  // Create an array to store task data
  const taskData = [];
  // Iterate over each task item
  tasks.forEach(task => {
    // Get the task content
    const taskContent = task.querySelector(".task").textContent;
    // Check if the task is completed
    const isCompleted = !task.classList.contains("pending");
    // Store task data as an object
    taskData.push({ content: taskContent, completed: isCompleted });
  });
  // Store task data in local storage as JSON
  localStorage.setItem("tasks", JSON.stringify(taskData));
}

// Function to load tasks from local storage
function loadTasks() {
  // Get saved tasks data from local storage
  const savedTasks = localStorage.getItem("tasks");
  // If there are saved tasks
  if (savedTasks) {
    // Parse JSON data
    const tasks = JSON.parse(savedTasks);
    // Iterate over each saved task
    tasks.forEach(task => {
      // Create HTML for the task
      const liTag = ` <li class="list ${task.completed ? '' : 'pending'}" onclick="handleStatus(this)">
        <input type="checkbox" ${task.completed ? 'checked' : ''} />
        <span class="task">${task.content}</span>
        <i class="uil uil-trash" onclick="deleteTask(this)"></i>
      </li>`;
      // Append task HTML to todoLists
      todoLists.insertAdjacentHTML("beforeend", liTag);
    });
    // Update pending tasks count
    updatePendingTasksCount();
  }
}

// Call loadTasks when the page loads
window.addEventListener("load", loadTasks);

// Function to handle adding a task
function addTask() {
  let inputVal = inputField.value.trim();

  // Check if inputVal is empty
  if (inputVal === "") {
    alert("Please enter a task.");
    return;
  }

  // Check if inputVal exceeds 35 characters
  if (inputVal.length > 35) {
    alert("Task must be 35 characters or less.");
    return;
  }

  let liTag = ` <li class="list pending" onclick="handleStatus(this)">
        <input type="checkbox" />
        <span class="task">${inputVal}</span>
        <i class="uil uil-trash" onclick="deleteTask(this)"></i>
      </li>`;

  todoLists.insertAdjacentHTML("beforeend", liTag);
  inputField.value = "";
  saveTasks();
  updatePendingTasksCount();
}

// Event listener for clicking the "Add" button
addBtn.addEventListener("click", addTask);

// Function to handle checking and unchecking a task
function handleStatus(task) {
  const checkbox = task.querySelector("input");
  checkbox.checked = !checkbox.checked;
  task.classList.toggle("pending");
  saveTasks();
  updatePendingTasksCount();
}

// Function to handle deleting a task
function deleteTask(task) {
  task.parentElement.remove();
  saveTasks();
  updatePendingTasksCount();
}

// Event listener for clicking the "Clear All" button
clearButton.addEventListener("click", () => {
  todoLists.innerHTML = "";
  saveTasks();
  updatePendingTasksCount();
});
