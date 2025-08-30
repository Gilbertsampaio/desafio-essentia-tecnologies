import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Importa Router e RouterModule
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Adiciona RouterModule
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  onRegister(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }

    this.authService.register(this.username, this.password).subscribe({
      next: (response) => {
        this.successMessage = 'Registro bem-sucedido! Redirecionando para login...';
        setTimeout(() => {
          this.router.navigate(['/login']); // Redireciona para login após registro
        }, 2000);
      },
      error: (err) => {
        console.error('Erro de registro:', err);
        if (err.status === 409) {
          this.errorMessage = 'Nome de usuário já existe.';
        } else {
          this.errorMessage = 'Erro ao registrar. Tente novamente.';
        }
      }
    });
  }
}
