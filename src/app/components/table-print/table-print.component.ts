import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GymService } from '../../services/gym.service';
import { Table, TableExercise, TableHistory } from '../../services/data.service';
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-table-print',
  standalone: true,
  imports: [CommonModule, MatIcon, MatButtonModule],
  templateUrl: './table-print.component.html',
  styleUrls: ['./table-print.component.scss']
})
export class TablePrintComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private gymService = inject(GymService);
  private originalTitle = '';

  tables: Table[] = [];
  historyName: string = '';
  historyDate: Date | null = null;
  // Número de series/columnas a mostrar (configurable)
  numberOfSets: number = 4;

  ngOnInit(): void {
    // Guardar el título original
    this.originalTitle = document.title;

    // Añadir clase print al body
    document.body.classList.add('print');

    // Obtener el ID del histórico de los parámetros de la ruta
    const historyId = this.route.snapshot.paramMap.get('historyId');

    if (historyId) {
      this.loadHistory(historyId);
    }
  }

  ngOnDestroy(): void {
    // Restaurar el título original
    document.title = this.originalTitle;

    // Remover clase print del body
    document.body.classList.remove('print');
  }

  loadHistory(historyId: string): void {
    // Buscar el histórico
    const historic = this.gymService.tablesHistoricSig().find(h => h._id === historyId);
    
    if (historic) {
      this.historyName = historic.name;
      this.historyDate = historic.createdAt;
      
      // Establecer el título del documento para la impresión
      document.title = this.historyName;
      
      // Parsear las tablas si están en formato string
      this.tables = historic.tables.map(tableStr => {
        if (typeof tableStr === 'string') {
          return JSON.parse(tableStr) as Table;
        }
        return tableStr;
      });
    }
  }

  // Generar array de números para las series
  getSetsArray(): number[] {
    return Array.from({ length: this.numberOfSets }, (_, i) => i + 1);
  }

  print(): void {
    window.print();
  }

  close(): void {
    this.router.navigate(['/historico']);
  }
}
