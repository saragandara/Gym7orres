import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { DataService, Exercise, Category } from '../../services/data.service';
import { GymService } from '../../services/gym.service';

@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule
  ],
  templateUrl: './exercise-form.component.html',
  styleUrl: './exercise-form.component.scss'
})
export class ExerciseFormComponent {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  private gymService = inject(GymService);
  private dialogRef = inject(MatDialogRef<ExerciseFormComponent>);
  data = inject(MAT_DIALOG_DATA, { optional: true });

  exerciseForm: FormGroup;
  isEditMode = signal(false);
  exerciseId = signal<string | null>(null);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  categories = signal<Category[]>([]);

  constructor() {
    // Obtener categorías
    this.categories.set(this.gymService.categoriesSig());

    // Inicializar el formulario
    this.exerciseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
      categoryId: ['', Validators.required]
    });

    // Si hay datos, estamos en modo edición
    if (this.data?.exercise) {
      this.isEditMode.set(true);
      this.exerciseId.set(this.data.exercise._id);
      this.exerciseForm.patchValue({
        name: this.data.exercise.name,
        categoryId: this.data.exercise.categoryId
      });
    } else if (this.data?.categoryId) {
      // Si se proporciona categoryId, preseleccionar la categoría
      this.exerciseForm.patchValue({
        categoryId: this.data.categoryId
      });
    }
  }

  onSubmit() {
    if (this.exerciseForm.invalid) {
      this.exerciseForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const exerciseData: Partial<Exercise> = {
      name: this.exerciseForm.value.name.trim(),
      categoryId: this.exerciseForm.value.categoryId
    };

    const operation = this.isEditMode()
      ? this.dataService.updateExercise(this.exerciseId()!, exerciseData)
      : this.dataService.createExercise(exerciseData);

    operation.subscribe({
      next: (exercise) => {
        this.isSubmitting.set(false);
        this.dialogRef.close({ success: true, exercise });
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          error.error?.error || 'Error al guardar el ejercicio'
        );
        console.error('Error al guardar ejercicio:', error);
      }
    });
  }

  onCancel() {
    this.dialogRef.close({ success: false });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.exerciseForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('minlength')) {
      return 'El nombre debe tener al menos 1 carácter';
    }
    if (field?.hasError('maxlength')) {
      return 'El nombre no puede exceder 200 caracteres';
    }
    return '';
  }
}
