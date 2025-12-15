import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { GymService } from '../../services/gym.service';
import { Table, TableHistory } from '../../services/data.service';

import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-tables-historic',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatCardModule],
  templateUrl: './tables-historic.component.html',
  styleUrls: ['./tables-historic.component.scss']
})
export class TablesHistoricComponent implements OnInit {
  private navigationService = inject(NavigationService);

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
}
