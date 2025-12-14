import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService, Table } from '../../services/data.service';

@Component({
  selector: 'app-table-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './table-form.component.html',
  styleUrl: './table-form.component.scss'
})
export class TableFormComponent {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  private dialogRef = inject(MatDialogRef<TableFormComponent>);
  data = inject(MAT_DIALOG_DATA, { optional: true });

  tableForm: FormGroup;
  isEditMode = signal(false);
  tableId = signal<string | null>(null);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    // Inicializar el formulario
    this.tableForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(500)]]
    });

    // Si hay datos, estamos en modo edición
    if (this.data?.table) {
      this.isEditMode.set(true);
      this.tableId.set(this.data.table._id);
      this.tableForm.patchValue({
        name: this.data.table.name,
        description: this.data.table.description || ''
      });
    }
  }

  onSubmit() {
    if (this.tableForm.invalid) {
      this.tableForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const tableData: Partial<Table> = {
      name: this.tableForm.value.name.trim(),
      description: this.tableForm.value.description?.trim() || undefined,
      exercises: this.data?.table?.exercises || []
    };

    const operation = this.isEditMode()
      ? this.dataService.updateTable(this.tableId()!, tableData)
      : this.dataService.createTable(tableData);

    operation.subscribe({
      next: (table) => {
        this.isSubmitting.set(false);
        this.dialogRef.close({ success: true, table });
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          error.error?.error || 'Error al guardar la tabla'
        );
        console.error('Error al guardar tabla:', error);
      }
    });
  }

  onCancel() {
    this.dialogRef.close({ success: false });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.tableForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('minlength')) {
      return 'El nombre debe tener al menos 1 carácter';
    }
    if (field?.hasError('maxlength')) {
      const maxLength = fieldName === 'name' ? 200 : 500;
      return `No puede exceder ${maxLength} caracteres`;
    }
    return '';
  }
}
