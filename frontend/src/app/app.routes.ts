import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard'; // Iremos criar este guard
import { TaskListComponent } from './components/task-list/task-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthDashboardComponent } from './components/auth-dashboard/auth-dashboard.component'; // Importe o AuthDashboardComponent

export const routes: Routes = [
  // A rota raiz agora ser� o AuthDashboardComponent
  // Este componente ir� gerenciar a renderiza��o condicional
  {
    path: '',
    component: AuthDashboardComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      // Protege a rota de tarefas com um AuthGuard
      { path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard] },
      // Redireciona a rota padr�o para login
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      // Rota curinga para qualquer outra URL n�o encontrada
      { path: '**', redirectTo: 'login' }
    ]
  },
];
