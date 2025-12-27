import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/historico',
    pathMatch: 'full'
  },
  {
    path: 'historico',
    loadComponent: () => import('./pages/tables-historic/tables-historic.component').then(m => m.TablesHistoricComponent)
  },
  {
    path: 'gestion',
    loadComponent: () => import('./pages/tables-manage/tables-manage.component').then(m => m.TablesManageComponent)
  },
  {
    path: 'print/:historyId',
    loadComponent: () => import('./components/table-print/table-print.component').then(m => m.TablePrintComponent)
  }
];
