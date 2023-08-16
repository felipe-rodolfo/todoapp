const fs = require("fs");
import {v4 as uuid  } from "uuid";

const DB_FILE_PATH = "./core/db";

type UUID = string;

interface Todo {
    id: string;
    date: string;
    content: string;
    done: boolean;
}

function create(content: string): Todo{
    const todo: Todo = {
        id: uuid(),
        date: new Date().toISOString(),
        content: content,
        done: false
    }
    const todos: Array<Todo> = [
        ...read(),
        todo,
    ]
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos,
    }, null, 2));
    return todo;
}

function read(): Array<Todo>{
    const dbString = fs.readFileSync(DB_FILE_PATH, "UTF-8");
    const db = JSON.parse(dbString || "{}");
    if(!db.todos)
        return [];
    return db.todos
}

function update(id: UUID, partialTodo: Partial<Todo>): Todo{
    let updatedTodo;
    const todos = read();
    todos.forEach((currentTodo) => {
        const isToUpdate = currentTodo.id === id;
        if(isToUpdate){
            updatedTodo = Object.assign(currentTodo, partialTodo)
        }
    });

    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({todos}, null, 2))
    if(!updatedTodo)
        throw new Error("Please, provide another id");
    return updatedTodo;
}

function updateContentById(id: UUID, content: string): Todo{
    return update(id, {
            content
        }
    )
}

function deleteById(id: UUID){
    const todos = read();

    const todosWithoutOne = todos.filter((todo) => {
        if(id === todo.id)
            return false;
        return true;
    });
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify({
        todos: todosWithoutOne
    }, null, 2))
}

function CLEAR_DB(){
    fs.writeFileSync(DB_FILE_PATH, "");
}

CLEAR_DB();

create("Watch classroom");
const secondTodo = create("Workout");
updateContentById(secondTodo.id, "Second TODO with new content");
deleteById(secondTodo.id)
console.log(read());