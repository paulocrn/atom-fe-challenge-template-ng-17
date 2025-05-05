import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
// import dotenv from "dotenv";
import { Observable } from "rxjs";

import { Todo } from "./todo.service";

// dotenv.config();

@Injectable({
    providedIn: "root"
})
export class ApiService {
    // private apiUrl = "https://tasks-api-nl0o.onrender.com/api";
    private apiUrl = "http://localhost:3000/api";

    constructor(private http: HttpClient) {
        /* if (process.env["NODE_ENV"] === "production") {
            this.apiUrl = "https://tasks-api-nl0o.onrender.com/api";
        } else {
            this.apiUrl = "http://localhost:3000/api";
        } */
    }

    private static getAuthHeaders(token?: string): HttpHeaders {
        const jwt = token || localStorage.getItem("jwt") || "";
        return new HttpHeaders({
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json"
        });
    }

    getTasks(): Observable<any[]> {
        return this.http.get<Todo[]>(`${this.apiUrl}/tasks`, {
            headers: ApiService.getAuthHeaders()
        });
    }

    addTask(task: { titulo: string; descripcion: string }, token: string): Observable<Todo> {
        return this.http.post<Todo>(`${this.apiUrl}/tasks`, task, { headers: ApiService.getAuthHeaders(token) });
    }

    createUser(email: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/users`, { email }, {
            headers: ApiService.getAuthHeaders()
        });
    }

    login(email: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/users/${email}`);
    }

    deleteTask(taskId: number, token: string): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/tasks/${taskId}`,
            { headers: ApiService.getAuthHeaders(token) }
        );
    }

    updateTaskCompletion(taskId: number, completed: boolean, token: string): Observable<Todo> {
        return this.http.put<Todo>(
            `${this.apiUrl}/tasks/${taskId}`,
            { completed },
            { headers: ApiService.getAuthHeaders(token) }
        );
    }
}
