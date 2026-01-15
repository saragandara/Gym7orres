import { Injectable, signal } from '@angular/core';

export type PageRoute = 'historico' | 'gestion' | 'ejercicios';

export interface NavigationState {
  currentPage: PageRoute;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  // Signal para el estado de navegación
  private _navigationState = signal<NavigationState>({
    currentPage: 'historico',
    title: 'Histórico de Tablas'
  });

  // Signal de solo lectura para consumo externo
  readonly navigationState = this._navigationState.asReadonly();

  // Mapa de rutas a títulos
  private readonly pageTitles: Record<PageRoute, string> = {
    historico: 'Histórico de Tablas',
    gestion: 'Gestión de Tablas',
    ejercicios: 'Listado de Ejercicios'
  };

  setCurrentPage(page: PageRoute): void {
    this._navigationState.set({
      currentPage: page,
      title: this.pageTitles[page]
    });
  }

  getCurrentPage(): PageRoute {
    return this._navigationState().currentPage;
  }

  getPageTitle(): string {
    return this._navigationState().title;
  }
}
