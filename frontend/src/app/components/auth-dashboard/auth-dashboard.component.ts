import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; 
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './auth-dashboard.component.html',
  styleUrls: ['./auth-dashboard.component.scss']
})
export class AuthDashboardComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  userName: string = 'Usu?rio'; // Valor padr?o inicial
  private authSubscription: Subscription | undefined;
  private userNameSubscription: Subscription | undefined;
  showConfirmModal: boolean = false; // Propriedade para controlar a visibilidade do modal de confirma??o

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Assina o estado de autentica??o para reagir a mudan?as de login/logout
    this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });

    // Assina o nome de usu?rio para reagir a mudan?as, garantindo atualiza??o em tempo real
    this.userNameSubscription = this.authService.userName$.subscribe(name => {
      this.userName = name;
    });
  }

  ngOnDestroy(): void {
    // Cancela as inscri??es para evitar vazamento de mem?ria
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.userNameSubscription) {
      this.userNameSubscription.unsubscribe();
    }
  }

  // M?todo para abrir o modal de confirma??o
  openLogoutModal(): void {
    this.showConfirmModal = true;
  }

  // M?todo para fechar o modal sem sair
  cancelLogout(): void {
    this.showConfirmModal = false;
  }

  // M?todo que executa o logout, chamado ap?s a confirma??o
  logout(): void {
    this.showConfirmModal = false; // Fecha o modal
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
