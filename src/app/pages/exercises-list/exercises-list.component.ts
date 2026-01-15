import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GymService } from '../../services/gym.service';
import { Category, Exercise } from '../../services/data.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ExerciseFormComponent } from '../../components/exercise-form/exercise-form.component';

interface ExercisesByCategory {
  category: Category;
  exercises: Exercise[];
}

@Component({
  selector: 'app-exercises-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatChipsModule],
  templateUrl: './exercises-list.component.html',
  styleUrl: './exercises-list.component.scss'
})
export class ExercisesListComponent implements OnInit {
  private gymService = inject(GymService);
  private dialog = inject(MatDialog);

  categories = this.gymService.categoriesSig;
  exercises = this.gymService.exercisesSig;

  // Computed signal para agrupar ejercicios por categoría
  exercisesByCategory = computed<ExercisesByCategory[]>(() => {
    const categories = this.categories();
    const exercises = this.exercises();
    
    return categories.map(category => ({
      category,
      exercises: exercises.filter(ex => ex.categoryId === category._id)
    })).filter(item => item.exercises.length > 0);
  });

  ngOnInit(): void {
    this.gymService.getCategories();
    this.gymService.getExercises();
  }

  openExerciseForm(exercise: Exercise): void {
    const dialogRef = this.dialog.open(ExerciseFormComponent, {
      width: '600px',
      data: { exercise }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.gymService.getExercises();
      }
    });
  }
}
