// находим инпут форму
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

// save data storage
let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

function addTask(event) {
  // event is (e)
  event.preventDefault(); // отменяем отправку формы

  // достаем текс задачи из поля ввода
  const taskText = taskInput.value;

  // описываем задачу в виде объекта
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  tasks.push(newTask);

  saveToLocalStorege();

  renderTask(newTask);

  // очищаем поле ввода и возвращаем фокус
  taskInput.value = "";
  taskInput.focus();

  checkEmptyList();
}

function deleteTask(event) {
  // проверяем клик по кнопке удалить
  if (event.target.dataset.action !== "delete") return;

  const parentsNode = event.target.closest(".list-group-item");

  // определяем ид задачи
  const id = Number(parentsNode.id);

  // находим мндекс задачи в массиве
  const index = tasks.findIndex((task) => task.id === id);

  // удаляем задачу из массива
  tasks.splice(index, 1);

  saveToLocalStorege();

  // удаляем задачу из разметки
  parentsNode.remove();

  checkEmptyList();
}

function doneTask(event) {
  // проеверяем клик по кнопке выполнено
  if (event.target.dataset.action !== "done") return;

  const parentsNode = event.target.closest(".list-group-item");

  const id = Number(parentsNode.id);
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;

  const taskTitle = parentsNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");

  saveToLocalStorege();

  checkEmptyList();
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListElement = `
    <li id="emptyList" class="list-group-item empty-list">
    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
    <div class="empty-list__title">Список дел пуст</div>
  </li>`;

    taskList.insertAdjacentHTML("afterbegin", emptyListElement);
  }

  if (tasks.length > 0) {
    const emptyListE = document.querySelector("#emptyList");
    emptyListE ? emptyListE.remove() : null;
  }
}

// save the data in local storage browser
function saveToLocalStorege() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  // формируем разметку для новой задачи
  const taskHTML = `
  <li id = '${task.id}' class="list-group-item d-flex justify-content-between task-item">
  <span class="${cssClass}">${task.text}</span>
  <div class="task-item__buttons">
    <button type="button" data-action="done" class="btn-action">
      <img src="./img/tick.svg" alt="Done" width="18" height="18">
    </button>
    <button type="button" data-action="delete" class="btn-action">
      <img src="./img/cross.svg" alt="Done" width="18" height="18">
    </button>
  </div>
</li>`;

  // добовлякм таск на страницу
  taskList.insertAdjacentHTML("beforeend", taskHTML);
}

// add task
form.addEventListener("submit", addTask);

// remove task
taskList.addEventListener("click", deleteTask);

// done task
taskList.addEventListener("click", doneTask);
