import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: "app-create-user-dialog",
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: "./create-user-dialog.component.html",
    styleUrl: "./create-user-dialog.component.scss"
})
export class CreateUserDialogComponent {
    constructor(
        private dialogRef: MatDialogRef<CreateUserDialogComponent>
    ) {}

    onYes() {
        this.dialogRef.close(true);
    }

    onNo() {
        this.dialogRef.close(false);
    }
}
