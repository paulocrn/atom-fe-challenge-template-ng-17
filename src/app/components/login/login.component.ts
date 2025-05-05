import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Component, inject, signal } from "@angular/core";
import {
    FormBuilder, FormGroup, ReactiveFormsModule, Validators
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router";
import {
    catchError, tap, throwError
} from "rxjs";

import { ApiService } from "../../services/api.service";
import { CreateUserDialogComponent } from "../dialogs/create-user-dialog/create-user-dialog.component";

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

    constructor(private fb: FormBuilder, private router: Router, private dialog: MatDialog) {
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
                this.form.get("email")?.setErrors({ email: "Usuario no encontrado" });

                if (err.status === 404) {
                    const dialogRef = this.dialog.open(CreateUserDialogComponent);

                    dialogRef.afterClosed().subscribe((result) => {
                        if (result) {
                            this.apiService.createUser(email).subscribe({
                                next: () => {
                                    const emailControl = this.form.get("email");
                                    emailControl?.setErrors(null);
                                    emailControl?.markAsPristine();
                                    emailControl?.markAsUntouched();

                                    this.login();
                                },
                                error: (e) => console.error("Error al crear usuario", e)
                            });
                        }
                    });
                } else {
                    console.error("Otro error", err);
                }
                return throwError(() => err);
            })
        ).subscribe();
    }
}
