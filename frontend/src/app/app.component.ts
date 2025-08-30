import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // O RouterModule é essencial para o <router-outlet>

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule // Mantenha apenas RouterModule para lidar com o roteamento
    // Remova 'AuthDashboardComponent' daqui, pois ele será carregado via router-outlet
  ],
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
}
