import { Routes } from "@angular/router";

import { AuthGuard } from "./guards/AuthGuard";

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/login",
        pathMatch: "full"
    },
    {
        path: "login",
        loadComponent: () => import("./components/login/login.component").then((m) => m.LoginComponent)
    },
    {
        path: "home",
        loadComponent: () => import("./components/todo-list/todo-list.component").then((m) => m.TodoListComponent),
        canActivate: [AuthGuard]
    },
];
