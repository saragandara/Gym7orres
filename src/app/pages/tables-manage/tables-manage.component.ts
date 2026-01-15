import { Component, effect, inject, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { CdkDragDrop, CdkDropList, CdkDrag, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { forkJoin } from 'rxjs';

import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

import { GymService } from '../../services/gym.service';
import { DataService, Category, Exercise, Table, ExerciseWithTableData } from '../../services/data.service';
import { NavigationService } from '../../services/navigation.service';
import { CategoryFormComponent } from '../../components/category-form/category-form.component';
import { ExerciseFormComponent } from '../../components/exercise-form/exercise-form.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { TableFormComponent } from '../../components/table-form/table-form.component';
import { TableHistoryFormComponent } from '../../components/table-history-form/table-history-form.component';

@Component({
  selector: 'app-tables-manage',
  standalone: true,
  imports: [RouterOutlet, JsonPipe, CdkDropList, CdkDrag, CdkDropListGroup, MatCardModule, MatButtonModule, MatIconModule, MatMenuModule, MatSelectModule, MatFormFieldModule, MatInputModule],
  templateUrl: './tables-manage.component.html',
  styleUrls: ['./tables-manage.component.scss']
})
export class TablesManageComponent {
  protected readonly title = signal('tablas-gym');

  gymService = inject(GymService);
  dataService = inject(DataService);
  dialog = inject(MatDialog);
  private navigationService = inject(NavigationService);

  // Acceso a la signal de navegación
  navState = this.navigationService.navigationState;

  // Filtro de categorías
  selectedCategoriesFilter = signal<string[]>([]);
  
  // Búsqueda de ejercicios
  exerciseSearchText = signal<string>('');
  
  // Computed para categorías filtradas
  filteredCategories = computed(() => {
    const selected = this.selectedCategoriesFilter();
    const searchText = this.exerciseSearchText();
    const allCategories = this.gymService.categoriesSig();
    
    let categories = allCategories;
    
    // Filtrar por categorías seleccionadas
    if (selected.length > 0) {
      categories = categories.filter(cat => selected.includes(cat._id));
    }
    
    // Si hay búsqueda activa, filtrar categorías que tengan al menos un ejercicio
    if (searchText.trim().length > 0) {
      categories = categories.filter(cat => {
        const exercises = this.getFilteredExercisesByCategory(cat._id);
        return exercises.length > 0;
      });
    }
    
    return categories;
  });

  // Computed para contar ejercicios filtrados
  exercisesCount = computed(() => {
    const searchText = this.exerciseSearchText();
    const categories = this.filteredCategories();
    const totalExercises = this.gymService.exercisesSig().length;
    
    if (searchText.trim().length === 0) {
      return { visible: totalExercises, total: totalExercises };
    }
    
    let visibleCount = 0;
    categories.forEach(cat => {
      visibleCount += this.getFilteredExercisesByCategory(cat._id).length;
    });
    
    return { visible: visibleCount, total: totalExercises };
  });

  ngOnInit() {
    // Actualizar el estado de navegación al entrar en esta página
    this.navigationService.setCurrentPage('gestion');

    // Añadir clase tables-manage al body
    document.body.classList.add('tables-manage');
    
    this.gymService.getCategories();
    this.gymService.getExercises();
    this.gymService.getTables();
    this.gymService.getTablesHistoric();
  }

  exportDatabaseDump() {
    // Obtener fecha y hora actual para el nombre de la carpeta
    const now = new Date();
    const folderName = `gym7orres-backup-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
    
    // Obtener datos de cada colección
    const categories = this.gymService.categoriesSig();
    const exercises = this.gymService.exercisesSig();
    const tables = this.gymService.tablesSig();
    const tablesHistory = this.gymService.tablesHistoricSig();
    
    // Crear scripts de importación
    const importScript = `# Scripts de importación para MongoDB
# Ejecutar estos comandos desde la terminal en el directorio donde están los archivos JSON

# Importar categorías
mongoimport --db gym7orres --collection categories --file categories.json --jsonArray --drop

# Importar ejercicios
mongoimport --db gym7orres --collection exercises --file exercises.json --jsonArray --drop

# Importar tablas
mongoimport --db gym7orres --collection tables --file tables.json --jsonArray --drop

# Importar histórico de tablas
mongoimport --db gym7orres --collection tables_history --file tables_history.json --jsonArray --drop

# Nota: El flag --drop elimina la colección existente antes de importar
# Si deseas preservar datos existentes, elimina el flag --drop
`;

    // Crear archivos para descargar
    this.downloadFile(`${folderName}/categories.json`, JSON.stringify(categories, null, 2));
    this.downloadFile(`${folderName}/exercises.json`, JSON.stringify(exercises, null, 2));
    this.downloadFile(`${folderName}/tables.json`, JSON.stringify(tables, null, 2));
    this.downloadFile(`${folderName}/tables_history.json`, JSON.stringify(tablesHistory, null, 2));
    this.downloadFile(`${folderName}/import-instructions.txt`, importScript);
    
    alert(`Se han descargado 5 archivos. Organízalos en una carpeta llamada "${folderName}"`);
  }

  private downloadFile(filename: string, content: string) {
    const blob = new Blob([content], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  onCategoryFilterChange(selectedIds: string[]) {
    this.selectedCategoriesFilter.set(selectedIds);
  }

  clearCategoryFilter() {
    this.selectedCategoriesFilter.set([]);
  }

  onExerciseSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.exerciseSearchText.set(value);
  }

  clearExerciseSearch() {
    this.exerciseSearchText.set('');
  }

  clearAllFilters() {
    this.selectedCategoriesFilter.set([]);
    this.exerciseSearchText.set('');
  }

  getExercisesByCategory(categoryId: string): Exercise[] {
    const exs = this.gymService.exercisesSig();
    return exs.filter(ex => ex.categoryId === categoryId);
  }

  getFilteredExercisesByCategory(categoryId: string): Exercise[] {
    const exercises = this.getExercisesByCategory(categoryId);
    const searchText = this.exerciseSearchText().toLowerCase().trim();
    
    if (searchText.length === 0) {
      return exercises;
    }
    
    return exercises.filter(ex => 
      ex.name.toLowerCase().includes(searchText)
    );
  }

  isExerciseInUse(exerciseId: string): boolean {
    const tables = this.gymService.tablesSig();
    return tables.some(table => 
      table.exercises.some(te => te.exerciseId === exerciseId)
    );
  }

  drop(event: CdkDragDrop<Exercise[]>) {
    const targetId = event.container.id;
    const sourceId = event.previousContainer.id;
    
    // Verificar si el destino es una tabla
    const targetTable = this.gymService.tablesSig().find(t => t._id === targetId);
    const sourceTable = this.gymService.tablesSig().find(t => t._id === sourceId);
    
    if (event.previousContainer === event.container) {
      // Movimiento dentro del mismo contenedor
      if (targetTable) {
        // Reordenar dentro de una tabla - actualizar los order
        const sortedExercises = [...targetTable.exercises].sort((a, b) => a.order - b.order);
        const [movedItem] = sortedExercises.splice(event.previousIndex, 1);
        sortedExercises.splice(event.currentIndex, 0, movedItem);
        
        // Recalcular todos los order
        const updatedExercises = sortedExercises.map((ex, index) => ({
          ...ex,
          order: index
        }));
        
        this.dataService.updateTable(targetId, { exercises: updatedExercises }).subscribe({
          next: () => {
            this.gymService.getTables();
          },
          error: (error) => console.error('Error al reordenar ejercicios:', error)
        });
      } else {
        // Reordenar dentro de una categoría (comportamiento normal)
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      }
    } else {
      // Movimiento entre contenedores diferentes
      const movedExercise = event.previousContainer.data[event.previousIndex];
      
      if (targetTable && !sourceTable) {
        // Arrastrando de categoría a tabla
        // Verificar si el ejercicio ya existe en la tabla
        const exerciseExists = targetTable.exercises.some(
          te => te.exerciseId === movedExercise._id
        );
        
        if (exerciseExists) {
          console.warn('El ejercicio ya existe en esta tabla');
          return;
        }
        
        const sortedExercises = [...targetTable.exercises].sort((a, b) => a.order - b.order);
        
        // Obtener el color de la categoría
        const category = this.gymService.categoriesSig().find(c => c._id === movedExercise.categoryId);
        
        const tableExercise: any = {
          exerciseId: movedExercise._id,
          order: event.currentIndex,
          name: movedExercise.name,  // Desnormalizar el nombre
          color: category?.color,  // Desnormalizar el color de la categoría
          categoryId: movedExercise.categoryId,
          repeticiones: movedExercise.repeticiones || ''  // Incluir repeticiones
        };
        
        console.log('Ejercicio movido:', movedExercise);
        console.log('TableExercise a guardar:', tableExercise);
        
        // Insertar en la posición correcta
        sortedExercises.splice(event.currentIndex, 0, tableExercise);
        
        // Recalcular todos los order
        const updatedExercises = sortedExercises.map((ex, index) => ({
          ...ex,
          order: index
        }));
        
        this.dataService.updateTable(targetId, { exercises: updatedExercises }).subscribe({
          next: () => {
            this.gymService.getTables();
          },
          error: (error) => console.error('Error al agregar ejercicio a tabla:', error)
        });
      } else if (!targetTable && sourceTable) {
        // Arrastrando de tabla a categoría (remover de la tabla)
        const sortedExercises = [...sourceTable.exercises].sort((a, b) => a.order - b.order);
        sortedExercises.splice(event.previousIndex, 1);
        
        // Recalcular todos los order
        const updatedExercises = sortedExercises.map((ex, index) => ({
          ...ex,
          order: index
        }));
        
        this.dataService.updateTable(sourceId, { exercises: updatedExercises }).subscribe({
          next: () => {
            this.gymService.getTables();
          },
          error: (error) => console.error('Error al eliminar ejercicio de tabla:', error)
        });
      } else if (targetTable && sourceTable) {
        // Moviendo entre tablas
        const sourceSorted = [...sourceTable.exercises].sort((a, b) => a.order - b.order);
        const targetSorted = [...targetTable.exercises].sort((a, b) => a.order - b.order);
        
        // Remover del origen
        const [exerciseToMove] = sourceSorted.splice(event.previousIndex, 1);
        
        // Agregar al destino en la posición correcta
        targetSorted.splice(event.currentIndex, 0, exerciseToMove);
        
        // Recalcular order en ambas tablas
        const sourceExercises = sourceSorted.map((ex, index) => ({
          ...ex,
          order: index
        }));
        
        const targetExercises = targetSorted.map((ex, index) => ({
          ...ex,
          order: index
        }));
        
        // Actualizar ambas tablas
        this.dataService.updateTable(sourceId, { exercises: sourceExercises }).subscribe({
          next: () => {
            this.dataService.updateTable(targetId, { exercises: targetExercises }).subscribe({
              next: () => {
                this.gymService.getTables();
              },
              error: (error) => console.error('Error al actualizar tabla destino:', error)
            });
          },
          error: (error) => console.error('Error al actualizar tabla origen:', error)
        });
      } else {
        // Movimiento entre categorías (comportamiento original)
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex, 
          event.currentIndex,
        );
        
        // Actualizar el categoryId del ejercicio movido
        const movedExercise = event.container.data[event.currentIndex];
        this.dataService.updateExercise(movedExercise._id, { categoryId: targetId }).subscribe({
          next: () => {
            this.gymService.getExercises();
          },
          error: (error) => console.error('Error al actualizar ejercicio:', error)
        });
      }
    }
  }

  addExercise(categoryId: string) {
    const dialogRef = this.dialog.open(ExerciseFormComponent, {
      width: '500px',
      data: { categoryId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        // Recargar los ejercicios
        this.gymService.getExercises();
      }
    });
  }

  openCategoryForm(category?: Category) {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      width: '500px',
      data: { category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        // Recargar las categorías
        this.gymService.getCategories();
      }
    });
  }

  removeCategory(category: Category) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar categoría',
        message: '¿Estás seguro de que deseas eliminar esta categoría?',
        details: `Categoría: ${category.name}`,
        confirmText: 'Eliminar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        // Primero eliminar los ejercicios de la categoría
        this.dataService.deleteExercisesByCategory(category._id).subscribe({
          next: () => {
            // Luego eliminar la categoría
            this.dataService.deleteCategory(category._id).subscribe({
              next: () => {
                // Recargar las categorías y ejercicios
                this.gymService.getCategories();
                this.gymService.getExercises();
              },
              error: (error) => {
                console.error('Error al eliminar categoría:', error);
              }
            });
          },
          error: (error) => {
            console.error('Error al eliminar ejercicios de la categoría:', error);
          }
        });
      }
    });
  }

  openExerciseForm(exercise?: Exercise) {
    const dialogRef = this.dialog.open(ExerciseFormComponent, {
      width: '500px',
      data: { exercise }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        // Recargar los ejercicios
        this.gymService.getExercises();
      }
    });
  }

  removeExercise(exercise: Exercise) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar ejercicio',
        message: '¿Estás seguro de que deseas eliminar este ejercicio?',
        details: `Ejercicio: ${exercise.name}`,
        confirmText: 'Eliminar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.dataService.deleteExercise(exercise._id).subscribe({
          next: () => {
            // Recargar los ejercicios
            this.gymService.getExercises();
          },
          error: (error) => {
            console.error('Error al eliminar ejercicio:', error);
          }
        });
      }
    });
  }

  openTableForm(table?: Table) {
    const dialogRef = this.dialog.open(TableFormComponent, {
      width: '600px',
      data: { table }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        // Recargar las tablas
        this.gymService.getTables();
      }
    });
  }

  removeTable(table: Table) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar tabla',
        message: '¿Estás seguro de que deseas eliminar esta tabla?',
        details: `Tabla: ${table.name}`,
        confirmText: 'Eliminar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.dataService.deleteTable(table._id).subscribe({
          next: () => {
            // Recargar las categorías y ejercicios
            this.gymService.getTables();
          },
          error: (error) => {
            console.error('Error al eliminar tabla:', error);
          }
        });
      }
    });    
  }

  clearAllTables() {
    const currentTables = this.gymService.tablesSig();
    
    console.log('Tablas actuales:', currentTables.length);
    
    if (currentTables.length === 0) {
      alert('No hay tablas para eliminar');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Limpiar todas las tablas',
        message: '¿Estás seguro de que deseas eliminar todas las tablas?',
        details: `Se eliminarán ${currentTables.length} tabla(s). Esta acción no afecta al histórico.`,
        confirmText: 'Eliminar todas'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      
      if (confirmed) {
        // Crear un contador para seguimiento
        let deletedCount = 0;
        let errorCount = 0;
        
        // Eliminar todas las tablas una por una
        currentTables.forEach((table, index) => {
          this.dataService.deleteTable(table._id).subscribe({
            next: () => {
              deletedCount++;
              
              // Recargar cuando se complete la última eliminación
              if (deletedCount + errorCount === currentTables.length) {
                this.gymService.getTables();
              }
            },
            error: (error) => {
              errorCount++;
              console.error(`Error al eliminar tabla ${table.name}:`, error);
              
              // Recargar incluso si hay errores
              if (deletedCount + errorCount === currentTables.length) {
                this.gymService.getTables();
              }
            }
          });
        });
      }
    });
  }

  saveTablesHistory() {
    const dialogRef = this.dialog.open(TableHistoryFormComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        // Obtener todas las tablas actuales
        const currentTables = this.gymService.tablesSig();
        
        // Serializar las tablas como strings JSON (según el formato de la API)
        const tablesAsStrings = currentTables.map(table => JSON.stringify(table));

        // Crear el historial
        this.dataService.createTableHistory({
          name: name,
          tables: tablesAsStrings as any
        }).subscribe({
          next: (response) => {
            console.log('Historial guardado:', response);
            
            // Limpiar la colección de tablas
            this.dataService.deleteAllTables().subscribe({
              next: (deleteResponse) => {
                console.log('Tablas eliminadas:', deleteResponse);
                // Recargar las tablas (ahora vacías)
                this.gymService.getTables();
              },
              error: (error) => {
                console.error('Error al limpiar tablas:', error);
              }
            });
          },
          error: (error) => {
            console.error('Error al guardar historial:', error);
            alert('Error al guardar el historial de tablas');
          }
        });
      }
    });
  }

  getExercisesByTable(tableId: string): ExerciseWithTableData[] {
    const table = this.gymService.tablesSig().find(t => t._id === tableId);
    if (!table || !table.exercises) return [];
    
    // Ordenar por el campo order
    const sortedTableExercises = [...table.exercises].sort((a, b) => a.order - b.order);
    
    // Usar los datos desnormalizados directamente de la tabla
    // Si no existen (datos antiguos), buscar en la colección exercises
    const allExercises = this.gymService.exercisesSig();
    return sortedTableExercises
      .map(te => {
        // Si tiene name desnormalizado, usarlo directamente
        if (te.name) {
          return {
            _id: te.exerciseId,
            name: te.name,
            categoryId: te.categoryId || '',
            tableCategoryId: te.categoryId,
            order: te.order,
            repeticiones: te.repeticiones || ''
          } as ExerciseWithTableData;
        }
        
        // Fallback: buscar en la colección exercises (para datos antiguos)
        const exercise = allExercises.find(ex => ex._id === te.exerciseId);
        if (!exercise) {
          return {
            _id: te.exerciseId,
            name: `Ejercicio eliminado (${te.exerciseId.substring(0, 8)}...)`,
            categoryId: te.categoryId || '',
            tableCategoryId: te.categoryId,
            order: te.order,
            repeticiones: te.repeticiones || ''
          } as ExerciseWithTableData;
        }
        
        return {
          ...exercise,
          tableCategoryId: te.categoryId,
          order: te.order,
          repeticiones: te.repeticiones || exercise.repeticiones || ''
        } as ExerciseWithTableData;
      });
  }

  getCategoryColor(categoryId: string): string {
    const category = this.gymService.categoriesSig().find(c => c._id === categoryId);
    return category?.color || '#ccc';
  }

  getExerciseColor(tableId: string, exerciseId: string): string {
    const table = this.gymService.tablesSig().find(t => t._id === tableId);
    if (!table) return '#ccc';
    
    const tableExercise = table.exercises.find(te => te.exerciseId === exerciseId);
    // if (tableExercise?.color) return tableExercise.color;
    
    // Fallback: buscar el color de la categoría
    if (tableExercise?.categoryId) {
      return this.getCategoryColor(tableExercise.categoryId);
    }
    
    return '#ccc';
  }

  addExerciseToTable(tableId: string) {
    const dialogRef = this.dialog.open(ExerciseFormComponent, {
      width: '500px',
      data: { tableId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        // Aquí necesitarías agregar el ejercicio a la tabla
        // Esto requeriría un endpoint específico en el backend
        console.log('Ejercicio a agregar a tabla:', result.exercise);
        this.gymService.getTables();
      }
    });
  }

  removeExerciseFromTable(tableId: string, exercise: Exercise) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar ejercicio de la tabla',
        message: '¿Estás seguro de que deseas eliminar este ejercicio de la tabla?',
        details: `Ejercicio: ${exercise.name}`,
        confirmText: 'Eliminar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        // Buscar la tabla y eliminar el ejercicio de su array
        const table = this.gymService.tablesSig().find(t => t._id === tableId);
        if (table) {
          // Filtrar el ejercicio eliminado
          const filteredExercises = table.exercises.filter(
            te => te.exerciseId !== exercise._id
          );
          
          // Reordenar los ejercicios restantes
          const updatedExercises = filteredExercises.map((ex, index) => ({
            ...ex,
            order: index
          }));
          
          // Actualizar la tabla en la base de datos
          this.dataService.updateTable(tableId, { exercises: updatedExercises }).subscribe({
            next: () => {
              this.gymService.getTables();
            },
            error: (error) => {
              console.error('Error al eliminar ejercicio de la tabla:', error);
            }
          });
        }
      }
    });
  }

  ngOnDestroy(): void {
    // Remover clase tables-manage del body al destruir el componente
    document.body.classList.remove('tables-manage');
  }
}
