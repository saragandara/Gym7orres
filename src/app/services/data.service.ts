// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
  _id: string;  // ObjectId como string
  id?: number;  // Opcional para retrocompatibilidad
  name: string;
  color?: string;
}

export interface Exercise {
  _id: string;  // ObjectId como string
  id?: number;  // Opcional para retrocompatibilidad
  name: string;
  categoryId: string;  // ObjectId de la categoría como string
}

export interface ExerciseWithTableData extends Exercise {
  order?: number;  // Orden del ejercicio en la tabla
  tableCategoryId?: string;  // categoryId específico de la tabla (puede diferir del categoryId del ejercicio)
}

export interface TableExercise {
  exerciseId: string;  // ObjectId del ejercicio
  order: number;  // Orden del ejercicio en la tabla (requerido)
  name?: string;  // Nombre del ejercicio (1-200 caracteres, opcional)
  color?: string;  // Color heredado de la categoría (máx 20 caracteres, opcional)
  categoryId?: string;  // ObjectId de la categoría (opcional)
}

export interface Table {
  _id: string;  // ObjectId como string
  name: string;  // Nombre de la tabla (1-200 caracteres)
  description?: string;  // Descripción opcional (máx 500 caracteres)
  exercises: TableExercise[];  // Array de ejercicios
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TableHistory {
  _id: string;  // ObjectId como string
  name: string;  // Nombre del historial (1-200 caracteres)
  tables: Table[];  // Array de tablas
  createdAt: Date;  // Fecha de creación (auto-generada)
  updatedAt: Date;  // Fecha de última actualización (auto-generada)
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Categorías
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  getCategory(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/categories/${id}`);
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, category);
  }

  updateCategory(id: string, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/categories/${id}`, category);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categories/${id}`);
  }

  deleteExercisesByCategory(categoryId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categories/${categoryId}/exercises`);
  }

  // Ejercicios
  getExercises(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.apiUrl}/exercises`);
  }

  getExercisesByCategory(categoryId: string): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.apiUrl}/exercises/category/${categoryId}`);
  }

  getExercise(id: string): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.apiUrl}/exercises/${id}`);
  }

  createExercise(exercise: Partial<Exercise>): Observable<Exercise> {
    return this.http.post<Exercise>(`${this.apiUrl}/exercises`, exercise);
  }

  updateExercise(id: string, exercise: Partial<Exercise>): Observable<Exercise> {
    return this.http.put<Exercise>(`${this.apiUrl}/exercises/${id}`, exercise);
  }

  deleteExercise(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/exercises/${id}`);
  }

  // Tablas
  getTables(): Observable<Table[]> {
    return this.http.get<Table[]>(`${this.apiUrl}/tables`);
  }

  getTable(id: string): Observable<Table> {
    return this.http.get<Table>(`${this.apiUrl}/tables/${id}`);
  }

  createTable(table: Partial<Table>): Observable<Table> {
    return this.http.post<Table>(`${this.apiUrl}/tables`, table);
  }

  updateTable(id: string, table: Partial<Table>): Observable<Table> {
    return this.http.put<Table>(`${this.apiUrl}/tables/${id}`, table);
  }

  deleteTable(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tables/${id}`);
  }

  deleteAllTables(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tables`);
  }

  addExerciseToTable(tableId: string, exercise: TableExercise): Observable<Table> {
    return this.http.post<Table>(`${this.apiUrl}/tables/${tableId}/exercises`, exercise);
  }

  removeExerciseFromTable(tableId: string, exerciseId: string): Observable<Table> {
    return this.http.delete<Table>(`${this.apiUrl}/tables/${tableId}/exercises/${exerciseId}`);
  }

  // Historiales de Tablas
  getTablesHistory(): Observable<TableHistory[]> {
    return this.http.get<TableHistory[]>(`${this.apiUrl}/tables-history`);
  }

  getTableHistory(id: string): Observable<TableHistory> {
    return this.http.get<TableHistory>(`${this.apiUrl}/tables-history/${id}`);
  }

  createTableHistory(tableHistory: Partial<TableHistory>): Observable<TableHistory> {
    return this.http.post<TableHistory>(`${this.apiUrl}/tables-history`, tableHistory);
  }

  updateTableHistory(id: string, tableHistory: Partial<TableHistory>): Observable<TableHistory> {
    return this.http.put<TableHistory>(`${this.apiUrl}/tables-history/${id}`, tableHistory);
  }

  deleteTableHistory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tables-history/${id}`);
  }

  addTableToHistory(historyId: string, table: string): Observable<TableHistory> {
    return this.http.post<TableHistory>(`${this.apiUrl}/tables-history/${historyId}/tables`, { table });
  }

  removeTableFromHistory(historyId: string, tableIndex: number): Observable<TableHistory> {
    return this.http.delete<TableHistory>(`${this.apiUrl}/tables-history/${historyId}/tables/${tableIndex}`);
  }
}