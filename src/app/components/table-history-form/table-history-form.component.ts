import { Component, inject, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-table-history-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './table-history-form.component.html',
  styleUrls: ['./table-history-form.component.scss']
})
export class TableHistoryFormComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<TableHistoryFormComponent>);

  form: FormGroup;

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: { name?: string }) {
    // Inicializar el formulario con el nombre proporcionado o vacío
    this.form = this.fb.group({
      name: [data?.name || '', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.name);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
