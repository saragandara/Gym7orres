import { inject, Injectable, signal, WritableSignal } from '@angular/core';

import { DataService } from './data.service';
import { Category } from './data.service';
import { Exercise } from './data.service';
import { Table } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class GymService {

  dataService = inject(DataService);

  categoriesSig: WritableSignal<Category[]> = signal<Category[]>([]);
  exercisesSig: WritableSignal<Exercise[]> = signal<Exercise[]>([]);
  tablesSig: WritableSignal<Table[]> = signal<Table[]>([]);

  constructor() { }

  getCategories() {
    this.dataService.getCategories().subscribe({
      next: (categories) => {
        this.categoriesSig.set(categories);
        console.log('Categories from API:', categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }
  
  getExercises() {
    this.dataService.getExercises().subscribe({
      next: (exercises) => {
        this.exercisesSig.set(exercises);
        console.log('Exercises from API:', exercises);
      },
      error: (error) => {
        console.error('Error loading exercises:', error);
      }
    });
  }

  getTables() {
    this.dataService.getTables().subscribe({
      next: (tables) => {
        this.tablesSig.set(tables);
        console.log('Tables from API:', tables);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }
}
