import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { GymService } from '../../services/gym.service';
import { Table, TableHistory } from '../../services/data.service';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';

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
}
