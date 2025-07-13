const enterTaskTitleElement = document.querySelector("#new-task-input-title");
const enterTaskBodyElement = document.querySelector("#new-task-input-body");
const addTaskButton = document.querySelector("#add-new-task-button");
const taskTemplate = document.querySelector("#task-template");
const boards = document.querySelectorAll(".board");

let taskIdCounter = parseInt(localStorage.getItem("taskIdCounter")) || 1;
const storedTasks = JSON.parse(localStorage.getItem("listOfTaskObjects")) || [];

class Task {
	constructor(id, title, body, position) {
		this.id = id;
		this.title = title;
		this.body = body;
		this.position = position;
	}

	getTitle() {
		return this.title;
	}

	getBody() {
		return this.body;
	}
	getPosition() {
		return this.position;
	}
	setPosition(newPosition) {
		this.position = newPosition;
	}
}

let listOfTaskObjects = storedTasks.map(
	(task) => new Task(task.id, task.title, task.body, task.position)
);

function updateLocalStorageObjectList() {
	localStorage.setItem("listOfTaskObjects", JSON.stringify(listOfTaskObjects));
}

function duplicateTaskTemplate(uniqueId, title, body, position) {
	const newTask = taskTemplate.cloneNode(true);

	newTask.id = uniqueId;
	newTask.style.display = "flex";
	newTask.querySelector(".task-widget-title").textContent = title;
	newTask.querySelector(".task-widget-body").textContent = body;
	newTask.querySelector(".task-widget-title").id = `${uniqueId}-title`;
	newTask.querySelector(".task-widget-body").id = `${uniqueId}-body`;

	newTask.setAttribute("draggable", true);

	newTask.addEventListener("dragstart", (e) => {
		e.dataTransfer.setData("text/plain", e.target.id);
		e.target.classList.add("dragging");
	});

	newTask.addEventListener("dragend", (e) => {
		e.target.classList.remove("dragging");
	});

	const targetBoard = document.querySelector(`.${position}`);
	if (targetBoard) {
		targetBoard.appendChild(newTask);
	} else {
		document.querySelector(".to-do-board").appendChild(newTask);
	}
}

function addNewTask() {
	const enteredTitle = enterTaskTitleElement.value;
	const enteredBody = enterTaskBodyElement.value;
	if ((enteredTitle.trim() || enteredBody.trim()) === "") {
		return;
	}

	const uniqueId = `task-${taskIdCounter}`;
	const taskObject = new Task(
		uniqueId,
		enteredTitle,
		enteredBody,
		"to-do-board"
	);
	listOfTaskObjects.push(taskObject);
	updateLocalStorageObjectList();

	duplicateTaskTemplate(uniqueId, enteredTitle, enteredBody, "to-do-board");

	taskIdCounter++;
	localStorage.setItem("taskIdCounter", taskIdCounter);

	enterTaskTitleElement.value = "";
	enterTaskBodyElement.value = "";
}

function updateAllToDos() {
	if (!listOfTaskObjects) return;

	let idNeedsUpdate = false;
	for (let i = 0; i < listOfTaskObjects.length; i++) {
		let current = listOfTaskObjects[i];

		if (!current.id) {
			current.id = `task-${taskIdCounter}`;
			taskIdCounter++;
			idNeedsUpdate = true;
		}

		duplicateTaskTemplate(
			current.id,
			current.title,
			current.body,
			current.position
		);
	}
	localStorage.setItem("taskIdCounter", taskIdCounter);
	if (idNeedsUpdate) {
		updateLocalStorageObjectList();
	}
}

for (let i = 0; i < boards.length; i++) {
	const currentBoard = boards[i];
	currentBoard.addEventListener("dragover", function (e) {
		e.preventDefault();
		currentBoard.style.backgroundColor = "#8db3f0";
	});

	currentBoard.addEventListener("dragleave", function (e) {
		currentBoard.style.backgroundColor = "white";
	});

	currentBoard.addEventListener("drop", function (e) {
		e.preventDefault();
		const taskWidgetId = e.dataTransfer.getData("text/plain");
		const taskWidget = document.getElementById(taskWidgetId);
		if (taskWidget) {
			const boardDraggedTo = currentBoard.classList[1];

			const taskIndex = listOfTaskObjects.findIndex(
				(task) => task.id === taskWidgetId
			);

			if (taskIndex !== -1) {
				listOfTaskObjects[taskIndex].setPosition(boardDraggedTo);
				updateLocalStorageObjectList();
			}

			currentBoard.appendChild(taskWidget);
		}
		currentBoard.style.backgroundColor = "white";
	});
}

updateAllToDos();

addTaskButton.addEventListener("click", addNewTask);

document.querySelector("#test").addEventListener("click", function () {
	taskIdCounter = 1;
	localStorage.clear();
	listOfTaskObjects = [];
	window.location.reload();
});
