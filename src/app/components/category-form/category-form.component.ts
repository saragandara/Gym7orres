import { Component, inject, signal, input, output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService, Category } from '../../services/data.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  private dialogRef = inject(MatDialogRef<CategoryFormComponent>);
  data = inject(MAT_DIALOG_DATA, { optional: true });

  categoryForm: FormGroup;
  isEditMode = signal(false);
  categoryId = signal<string | null>(null);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    // Inicializar el formulario
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      color: ['#3498DB', [Validators.maxLength(20)]]
    });

    // Si hay datos, estamos en modo edición
    if (this.data?.category) {
      this.isEditMode.set(true);
      this.categoryId.set(this.data.category._id);
      this.categoryForm.patchValue({
        name: this.data.category.name,
        color: this.data.category.color || '#3498DB'
      });
    }
  }

  onSubmit() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const categoryData: Partial<Category> = {
      name: this.categoryForm.value.name.trim(),
      color: this.categoryForm.value.color
    };

    const operation = this.isEditMode()
      ? this.dataService.updateCategory(this.categoryId()!, categoryData)
      : this.dataService.createCategory(categoryData);

    operation.subscribe({
      next: (category) => {
        this.isSubmitting.set(false);
        this.dialogRef.close({ success: true, category });
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          error.error?.error || 'Error al guardar la categoría'
        );
        console.error('Error al guardar categoría:', error);
      }
    });
  }

  onCancel() {
    this.dialogRef.close({ success: false });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.categoryForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('minlength')) {
      return 'El nombre debe tener al menos 1 carácter';
    }
    if (field?.hasError('maxlength')) {
      const maxLength = fieldName === 'name' ? 100 : 20;
      return `No puede exceder ${maxLength} caracteres`;
    }
    return '';
  }
}
