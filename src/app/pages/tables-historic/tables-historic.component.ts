import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { GymService } from '../../services/gym.service';
import { DataService, Table, TableHistory } from '../../services/data.service';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { TableHistoryFormComponent } from '../../components/table-history-form/table-history-form.component';

@Component({
  selector: 'app-tables-historic',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatCardModule, MatIcon, MatButtonModule],
  templateUrl: './tables-historic.component.html',
  styleUrls: ['./tables-historic.component.scss']
})
export class TablesHistoricComponent implements OnInit {
  private navigationService = inject(NavigationService);
  private router = inject(Router);
  private dataService = inject(DataService);
  private dialog = inject(MatDialog);

  readonly panelOpenState = signal(false);
  gymService = inject(GymService);

  // Puedes acceder a la signal de navegación si lo necesitas
  navState = this.navigationService.navigationState;

  // Computed signal que parsea los strings JSON a objetos Table
  parsedTablesHistoric = computed(() => {
    return this.gymService.tablesHistoricSig().map(historic => ({
      ...historic,
      tables: historic.tables.map(tableStr => {
        if (typeof tableStr === 'string') {
          return JSON.parse(tableStr) as Table;
        }
        return tableStr;
      })
    }));
  });

  ngOnInit(): void {
    // Actualizar el estado de navegación al entrar en esta página
    this.navigationService.setCurrentPage('historico');

    this.gymService.getTablesHistoric();
  }

  openPrintView(historyId: string, event: Event): void {
    event.stopPropagation(); // Evitar que se abra/cierre el accordion
    this.router.navigate(['/print', historyId]);
  }

  cloneToManage(historyId: string, event: Event): void {
    event.stopPropagation(); // Evitar que se abra/cierre el accordion

    // Buscar el histórico
    const historic = this.parsedTablesHistoric().find(h => h._id === historyId);
    
    if (!historic) {
      console.error('Histórico no encontrado');
      return;
    }

    // Primero limpiar las tablas existentes
    this.dataService.deleteAllTables().subscribe({
      next: () => {
        // Crear cada tabla del histórico en la colección tables
        let tablesCreated = 0;
        const totalTables = historic.tables.length;

        if (totalTables === 0) {
          // Si no hay tablas, navegar directamente
          this.router.navigate(['/gestion']);
          return;
        }

        historic.tables.forEach((table) => {
          // Crear una copia sin el _id para que se genere uno nuevo
          const { _id, ...tableWithoutId } = table;
          
          this.dataService.createTable(tableWithoutId).subscribe({
            next: () => {
              tablesCreated++;
              // Cuando se hayan creado todas, navegar
              if (tablesCreated === totalTables) {
                this.router.navigate(['/gestion']);
              }
            },
            error: (error) => {
              console.error('Error al crear tabla:', error);
            }
          });
        });
      },
      error: (error) => {
        console.error('Error al limpiar tablas:', error);
      }
    });
  }

  deleteHistoric(historyId: string, historyName: string, event: Event): void {
    event.stopPropagation(); // Evitar que se abra/cierre el accordion

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de que deseas eliminar el histórico "${historyName}"? Esta acción no se puede deshacer.`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteTableHistory(historyId).subscribe({
          next: () => {
            console.log('Histórico eliminado correctamente');
            // Recargar la lista de históricos
            this.gymService.getTablesHistoric();
          },
          error: (error) => {
            console.error('Error al eliminar histórico:', error);
            alert('Error al eliminar el histórico');
          }
        });
      }
    });
  }

  editHistoricName(historyId: string, currentName: string, event: Event): void {
    event.stopPropagation(); // Evitar que se abra/cierre el accordion

    const dialogRef = this.dialog.open(TableHistoryFormComponent, {
      width: '400px',
      data: { name: currentName }
    });

    dialogRef.afterClosed().subscribe((newName: string | undefined) => {
      if (newName && newName !== currentName) {
        // Buscar el histórico completo
        const historic = this.gymService.tablesHistoricSig().find(h => h._id === historyId);
        
        if (!historic) {
          console.error('Histórico no encontrado');
          return;
        }

        // Crear objeto actualizado
        const updatedHistoric: TableHistory = {
          ...historic,
          name: newName
        };

        this.dataService.updateTableHistory(historyId, updatedHistoric).subscribe({
          next: () => {
            console.log('Nombre del histórico actualizado correctamente');
            // Recargar la lista de históricos
            this.gymService.getTablesHistoric();
          },
          error: (error) => {
            console.error('Error al actualizar el nombre:', error);
            alert('Error al actualizar el nombre del histórico');
          }
        });
      }
    });
  }
}
