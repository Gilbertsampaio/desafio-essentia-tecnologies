import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Importa Router e RouterModule
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Adiciona RouterModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    this.errorMessage = null; // Limpa mensagens de erro anteriores
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.router.navigate(['/tasks']); // Redireciona para a lista de tarefas
      },
      error: (err) => {
        console.error('Erro de login:', err);
        this.errorMessage = 'Usuário ou senha inválidos.';
      }
    });
  }
}