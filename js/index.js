const btnAdd = document.getElementById("btn-add");
const todosSection = document.getElementById("todos");
const title = document.getElementById("inp-add");
const deleteAll = document.getElementById("delete-all");

var todos = new Array();

class Todo {
    constructor(id, title, status) {
        this.id = id;
        this.title = title;
        this.status = status;
    }
}

window.onload = () => {
    if (localStorage.length === 0) return;

    for (const todo in localStorage) {
        if (isNaN(parseInt(todo))) {
        }
        if (!isNaN(parseInt(todo))) {
            let savedTodoInStorage = JSON.parse(localStorage[parseInt(todo)]);
            todos.push(savedTodoInStorage);
            setAtributtes(savedTodoInStorage);
        }
    }
};

const addTodo = () => {
    if (!title.value) return;

    let titleOfTodo = title.value.trim();

    if (titleOfTodo.length === 0) return;

    if (todos.length === 0) {
        const newTodo = new Todo(0, titleOfTodo, false);

        todos.push(newTodo);
        setAtributtes(newTodo);
        saveTodo(newTodo);
    } else {
        const idTodo = todos[todos.length - 1].id;
        const newTodo = new Todo(idTodo + 1, titleOfTodo, false);
        todos.push(newTodo);
        setAtributtes(newTodo);
        saveTodo(newTodo);
    }
};

const setAtributtes = (todo) => {
    const t = `<div class="todo" id="${todo.id}">
            <input
                onclick="toogleStatus(this);"
                class="check"
                type="checkbox"
                ${todo.status ? "checked" : ""}
            />
            <div ${todo.status ? 'class="text-of-todo"' : ""} >${
        todo.title
    }</div>

            <div class="delete-todo" onclick="removeTodo(this);">Eliminar</div>
        </div>`;

    todosSection.insertAdjacentHTML("beforeend", t);
    title.value = "";
};

const toogleStatus = (todo) => {
    const idTodo = parseInt(todo.parentNode.id);
    const indexTodoSaved = todos.findIndex((t) => t.id == idTodo);

    if (!todo.parentNode.children[1].classList.contains("text-of-todo")) {
        todo.parentNode.children[1].classList.add("text-of-todo");
        todos[indexTodoSaved].status = true;
        updateTodo(todos[indexTodoSaved].id, true);
        return;
    }
    todo.parentNode.children[1].classList.remove("text-of-todo");
    todos[indexTodoSaved].status = false;
    updateTodo(todos[indexTodoSaved].id, false);
};

const removeTodo = (todo) => {
    if (todos.length === 1) {
        deleteTodo(todos[0].id);
        todos = [];
    } else {
        const idTodo = parseInt(todo.parentNode.id);
        const indexTodoSaved = todos.findIndex((t) => t.id === idTodo);
        deleteTodo(todos[indexTodoSaved].id);
        todos.splice(indexTodoSaved, 1);
    }
    let garbage = todosSection.removeChild(todo.parentNode);
};

const tab = (tab) => {
    if (tab.id == "all") {
        deleteAll.style.display = "none";
        for (const t of todos) {
            document.getElementById(t.id).style.display = "flex";
        }

        document.getElementById("all").classList.remove("cell-not-focused");
        document.getElementById("all").classList.add("cell-focused");

        document.getElementById("active").classList.add("cell-not-focused");
        document.getElementById("active").classList.remove("cell-focused");

        document.getElementById("completed").classList.add("cell-not-focused");
        document.getElementById("completed").classList.remove("cell-focused");
    }
    if (tab.id == "active") {
        deleteAll.style.display = "none";
        for (const t of todos) {
            if (t.status) {
                document.getElementById(t.id).style.display = "none";
            }
            if (!t.status) {
                document.getElementById(t.id).style.display = "flex";
            }
        }
        document.getElementById("all").classList.add("cell-not-focused");
        document.getElementById("all").classList.remove("cell-focused");

        document.getElementById("active").classList.remove("cell-not-focused");
        document.getElementById("active").classList.add("cell-focused");

        document.getElementById("completed").classList.add("cell-not-focused");
        document.getElementById("completed").classList.remove("cell-focused");
    }
    if (tab.id == "completed") {
        deleteAll.style.display = "block";
        for (const t of todos) {
            if (!t.status) {
                document.getElementById(t.id).style.display = "none";
            }
            if (t.status) {
                document.getElementById(t.id).style.display = "flex";
            }
        }
        document.getElementById("all").classList.add("cell-not-focused");
        document.getElementById("all").classList.remove("cell-focused");

        document.getElementById("active").classList.add("cell-not-focused");
        document.getElementById("active").classList.remove("cell-focused");

        document
            .getElementById("completed")
            .classList.remove("cell-not-focused");
        document.getElementById("completed").classList.add("cell-focused");
    }
};

const saveTodo = (todo) => {
    localStorage.setItem(todo.id.toString(), JSON.stringify(todo));
};

const deleteTodo = (todoId) => {
    localStorage.removeItem(todoId.toString());
};

const updateTodo = (todoId, todoStatus) => {
    let todoSaved = localStorage.getItem(todoId);
    todoSaved = todoSaved ? JSON.parse(todoSaved) : {};
    todoSaved.status = todoStatus;
    localStorage.setItem(todoId.toString(), JSON.stringify(todoSaved));
};

deleteAll.addEventListener("click", () => {
    if (todos.length === 0) return;

    const result = todos.filter((t) => !t.status);
    const result2 = todos.filter((t) => t.status);
    todos = result;
    for (const r of result2) {
        const todoHTML = document.getElementById(r.id);
        todosSection.removeChild(todoHTML);
        deleteTodo(r.id);
    }
});

btnAdd.addEventListener("click", addTodo);
