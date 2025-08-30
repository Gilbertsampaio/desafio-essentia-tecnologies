import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { ITask } from '../../interfaces/task.interface';
import { Subscription } from 'rxjs'; // Importar Subscription

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: ITask[] = [];
  newTaskTitle: string = '';
  newTaskDescription: string = '';
  editingTask: ITask | null = null;

  // Variáveis para o sistema de notificações
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  private notificationTimer: any;

  // Variáveis para o modal de confirmação
  showConfirmModal: boolean = false;
  confirmMessage: string = '';
  confirmAction: (() => void) | null = null;
  private idToDelete: number | undefined; // Armazena o ID da tarefa a ser deletada

  private taskSubscription: Subscription | undefined;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  ngOnDestroy(): void {
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }
    this.clearNotificationTimer();
  }

  private displayNotification(message: string, type: 'success' | 'error'): void {
    this.clearNotificationTimer();
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    this.notificationTimer = setTimeout(() => {
      this.hideNotification();
    }, 4000);
  }

  private hideNotification(): void {
    this.showNotification = false;
    this.notificationMessage = '';
    this.clearNotificationTimer();
  }

  private clearNotificationTimer(): void {
    if (this.notificationTimer) {
      clearTimeout(this.notificationTimer);
      this.notificationTimer = null;
    }
  }

  loadTasks(): void {
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }
    this.taskSubscription = this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: (err) => {
        console.error('Erro ao carregar tarefas:', err);
        this.displayNotification('Não foi possível carregar as tarefas. Verifique se o backend está rodando.', 'error');
      }
    });
  }

  addTask(): void {
    if (!this.newTaskTitle.trim()) {
      this.displayNotification('O título da tarefa não pode ser vazio.', 'error');
      return;
    }

    const newTaskPayload: Omit<ITask, 'id' | 'completed' | 'created_at'> = {
      title: this.newTaskTitle,
      description: this.newTaskDescription.trim() || undefined,
    };

    this.taskService.addTask(newTaskPayload).subscribe({
      next: () => {
        this.displayNotification('Tarefa adicionada com sucesso!', 'success');
        this.newTaskTitle = '';
        this.newTaskDescription = '';
        this.loadTasks();
      },
      error: (err) => {
        console.error('Erro ao adicionar tarefa:', err);
        this.displayNotification('Erro ao adicionar tarefa. Tente novamente.', 'error');
      }
    });
  }

  editTask(task: ITask): void {
    this.editingTask = { ...task }; // Cria uma cópia para edição
  }

  saveEditedTask(): void {
    if (!this.editingTask || this.editingTask.id === undefined) {
      this.displayNotification('Não foi possível encontrar o ID da tarefa para edição.', 'error');
      return;
    }
    if (!this.editingTask.title.trim()) {
      this.displayNotification('O título da tarefa não pode ser vazio.', 'error');
      return;
    }

    // Agora o compilador sabe que `id` não é undefined
    this.taskService.updateTask(this.editingTask.id!, this.editingTask).subscribe({
      next: () => {
        this.displayNotification('Tarefa atualizada com sucesso!', 'success');
        this.editingTask = null;
        this.loadTasks();
      },
      error: (err) => {
        console.error('Erro ao atualizar tarefa:', err);
        this.displayNotification('Erro ao atualizar tarefa. Tente novamente.', 'error');
      }
    });
  }

  cancelEdit(): void {
    this.editingTask = null;
  }

  toggleCompleted(task: ITask): void {
    if (task.id === undefined) {
      this.displayNotification('Não foi possível encontrar o ID da tarefa para alternar o status.', 'error');
      return;
    }
    const updatedTask: ITask = { ...task, completed: !task.completed };
    
    // Agora o compilador sabe que `id` não é undefined
    this.taskService.updateTask(updatedTask.id!, updatedTask).subscribe({
      next: () => {
        this.displayNotification(`Tarefa ${updatedTask.completed ? 'concluída' : 'reaberta'}!`, 'success');
        this.loadTasks();
      },
      error: (err) => {
        console.error('Erro ao alternar conclusão da tarefa:', err);
        this.displayNotification('Erro ao atualizar status da tarefa.', 'error');
      }
    });
  }

  // Método para exibir o modal de confirmação
  confirmDelete(id: number | undefined): void {
    if (id === undefined) {
      this.displayNotification('ID da tarefa inválido para exclusão.', 'error');
      return;
    }
    this.confirmMessage = 'Tem certeza que deseja excluir esta tarefa?';
    this.idToDelete = id; // Armazena o ID para exclusão
    this.confirmAction = () => this.executeDeleteTask(); // Prepara a ação
    this.showConfirmModal = true;
  }

  // Executa a ação de deleção após a confirmação
  private executeDeleteTask(): void {
    if (this.idToDelete === undefined) {
      this.displayNotification('Erro interno: ID da tarefa não preparado para exclusão.', 'error');
      this.hideConfirmModal();
      return;
    }

    // Agora o compilador sabe que `idToDelete` não é undefined
    this.taskService.deleteTask(this.idToDelete!).subscribe({
      next: () => {
        this.displayNotification('Tarefa excluída com sucesso!', 'success');
        this.loadTasks();
      },
      error: (err) => {
        console.error('Erro ao excluir tarefa:', err);
        this.displayNotification('Erro ao excluir tarefa. Tente novamente.', 'error');
      }
    });
    this.hideConfirmModal();
  }

  // Esconde o modal de confirmação
  hideConfirmModal(): void {
    this.showConfirmModal = false;
    this.confirmMessage = '';
    this.confirmAction = null;
    this.idToDelete = undefined; // Limpa o ID após uso
  }

  // Método chamado pelo HTML para iniciar o fluxo de exclusão
  deleteTask(id: number | undefined): void {
    this.confirmDelete(id);
  }
}
