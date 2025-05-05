import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Component, inject, signal } from "@angular/core";
import {
    FormBuilder, FormGroup, ReactiveFormsModule, Validators
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router";
import {
    catchError, finalize, tap, throwError
} from "rxjs";

import { ApiService } from "../../services/api.service";

@Component({
    selector: "app-login",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule,
        HttpClientModule,
        MatInputModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule],
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
    apiService = inject(ApiService);
    form: FormGroup;
    token = signal<string | null>(null);

    constructor(private fb: FormBuilder, private router: Router) {
        this.form = this.fb.group({
            email: ["", [Validators.required, Validators.email]],
        });
    }

    login() {
        if (this.form.invalid) return;
        const { email } = this.form.value;

        this.apiService.login(email).pipe(
            tap((data: any) => {
                this.token.set(data.token);
                this.router.navigate(["/home"]);
                localStorage.setItem("jwt", data.token);
            }),
            catchError((err: any) => {
                console.error("Error consola", err);

                this.form.get("email")?.setErrors({ email: "Usuario no encontrado" });
                return throwError(() => err);
            }),
            finalize(() => {
            // You can add a callback here if you need to perform some action when the observable completes
            })
        ).subscribe();
    }
}
