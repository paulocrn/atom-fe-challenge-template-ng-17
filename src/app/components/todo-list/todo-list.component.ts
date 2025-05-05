import { CommonModule, NgFor } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { Router } from "@angular/router";

import { ApiService } from "../../services/api.service";
import { Todo } from "../../services/todo.service";
import { AddTaskDialogComponent } from "../dialogs/add-task-dialog/add-task-dialog.component";
import { ConfirmDialogComponent } from "../dialogs/confirm-dialog/confirm-dialog.component";

@Component({
    selector: "app-todo-list",
    standalone: true,
    imports: [NgFor, MatInputModule, MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatListModule,
        MatCheckboxModule,
        CommonModule,
        MatDialogModule
    ],
    templateUrl: "./todo-list.component.html",
    styleUrls: ["./todo-list.component.scss"]
})
export class TodoListComponent {
    todos: Todo[] = [];
    todosbycategory = signal<Record<string, Todo[]>>({});

    tasks: { titulo: string; descripcion: string }[] = [];

    apiService = inject(ApiService);

    constructor(private dialog: MatDialog, private addTaskDialog: MatDialog, private router: Router) {
        this.refreshTasks();

        console.log("info:", this.todosbycategory());
    }

    onTaskAdded(newTask: { titulo: string; descripcion: string }) {
        this.tasks.push(newTask);
    }

    categorizedTasks() {
        this.todosbycategory.set(this.todos.reduce((acc: { [key: string]: any }, task) => {
            let category = task.categoria || "Otros";

            if (task.completed) {
                category = "Completadas";
            }

            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(task);
            return acc;
        }, {}));
    }

    refreshTasks() {
        this.apiService.getTasks().subscribe((tasks: Todo[]) => {
            this.todos = tasks;
            this.categorizedTasks();
        });
    }

    addTodo(task: { titulo: string; descripcion: string; categoria?: string }) {
        const token = localStorage.getItem("jwt") || "";

        this.apiService.addTask(task, token).subscribe(() => {
            this.refreshTasks();
        });
    }

    toggleCompletion(task: Todo) {
        const token = localStorage.getItem("jwt") || "";
        const updatedTask = { ...task };
        const updatedStatus = !updatedTask.completed;

        updatedTask.completed = updatedStatus;

        this.apiService.updateTaskCompletion(task.id, updatedStatus, token).subscribe({
            next: () => this.refreshTasks(),
            error: () => {
                updatedTask.completed = !updatedStatus;
            }
        });
    }

    deleteTask(task: Todo) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: "650px",
            height: "250px",
            data: { message: `¿Seguro que deseas eliminar la tarea "${task.titulo}"?` }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.apiService.deleteTask(task.id, localStorage.getItem("jwt")!)
                    .subscribe({
                        next: () => this.refreshTasks(),
                        error: (err) => console.error("Error al eliminar:", err)
                    });
            }
        });
    }

    openTaskDialog(categoria?: string): void {
        const isNewCategory = !categoria;

        const dialogRef = this.addTaskDialog.open(AddTaskDialogComponent, {
            data: { categoria: categoria || "Otros", mostrarCategoria: isNewCategory },
            width: "450px"
        });

        dialogRef.afterClosed().subscribe((result) => {
            const { tmpCategoria } = categoria || result.categoria;
            console.log("result", tmpCategoria, result, categoria);
            if (result === true || result === undefined) return;
            if (result !== true) {
                if (result.titulo === "" || result.descripcion === "") {
                    return;
                }
                this.addTodo({ ...result, tmpCategoria });
            }
        });
    }

    formatFecha = (date?: Date | undefined): string => {
        if (!date) return this.formatFecha(new Date());

        const parsedDate = new Date(date);

        const formattedDate = `${parsedDate.getFullYear()}/${parsedDate.getMonth() + 1}/${parsedDate.getDate()}`;
        const formattedTime = `${parsedDate.getHours()}:${parsedDate.getMinutes().toString().padStart(2, "0")}`;

        return `${formattedDate} ${formattedTime}`;
    };

    logout() {
        localStorage.removeItem("jwt");
        this.router.navigate(["/login"]);
    }
}
