import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  private router = inject(Router);
  navigationService = inject(NavigationService);

  // Acceso a la signal de navegación
  navState = this.navigationService.navigationState;

  navigateTo(page: 'historico' | 'gestion'): void {
    this.navigationService.setCurrentPage(page);
    this.router.navigate([`/${page}`]);
  }
}
