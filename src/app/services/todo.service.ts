import { Injectable } from "@angular/core";

export interface Todo {
    id: number;
    titulo: string;
    descripcion: string;
    categoria?: string;
    completed: boolean;
    createdAt?: Date;
}

@Injectable({
    providedIn: "root"
})
export class TodoService {
    private todos: Todo[] = [];

    getTodos(): Todo[] {
        return this.todos;
    }

    addTodo(titulo: string, descripcion: string): void {
        const newTodo: Todo = {
            id: Date.now(),
            titulo,
            descripcion,
            completed: false
        };
        this.todos.push(newTodo);
    }

    toggleTodo(id: number): void {
        const todo = this.todos.find((t) => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
        }
    }

    deleteTodo(id: number): void {
        this.todos = this.todos.filter((t) => t.id !== id);
    }
}
