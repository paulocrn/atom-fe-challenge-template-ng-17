import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import {
    FormBuilder, FormGroup, ReactiveFormsModule, Validators
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

@Component({
    selector: "app-add-task-dialog",
    standalone: true,
    imports: [MatDialogModule, MatSelectModule, MatInputModule, CommonModule, ReactiveFormsModule],
    templateUrl: "./add-task-dialog.component.html",
    styleUrl: "./add-task-dialog.component.scss"
})
export class AddTaskDialogComponent {
    form: FormGroup;

    // @Inject(MAT_DIALOG_DATA) public data: any;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AddTaskDialogComponent>
    ) {
        this.form = this.fb.group({
            titulo: ["", [Validators.required]],
            descripcion: ["", [Validators.required]],
            categoria: [this.data?.categoria || "", this.data?.mostrarCategoria ? Validators.required : []]

        });
    }

    closeDialog(): void {
        this.dialogRef.close(true);
    }

    saveTask(): void {
        const { titulo } = this.form.value;
        const { descripcion } = this.form.value;
        const { categoria } = this.form.value || "";

        this.dialogRef.close({ titulo, descripcion, categoria });
    }
}
