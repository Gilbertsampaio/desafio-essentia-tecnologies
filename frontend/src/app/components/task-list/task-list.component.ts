import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})

export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTaskTitle: string = '';
  newTaskDescription: string = '';
  editingTask: Task | null = null;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: (err) => {
        console.error('Erro ao carregar tarefas:', err);
        alert('Não foi possível carregar as tarefas. Verifique se o backend está rodando.');
      }
    });
  }

  addTask(): void {
    if (!this.newTaskTitle.trim()) {
      alert('O título da tarefa não pode ser vazio.');
      return;
    }

    const taskToAdd: Omit<Task, 'id' | 'completed' | 'created_at'> = {
      title: this.newTaskTitle,
      description: this.newTaskDescription.trim() || undefined
    };

    this.taskService.addTask(taskToAdd).subscribe({
      next: (task) => {
        this.tasks.unshift(task);
        this.newTaskTitle = '';
        this.newTaskDescription = '';
      },
      error: (err) => {
        console.error('Erro ao adicionar tarefa:', err);
        alert('Não foi possível adicionar a tarefa.');
      }
    });
  }

  editTask(task: Task): void {
    this.editingTask = { ...task };
  }

  saveEditedTask(): void {
    if (!this.editingTask || !this.editingTask.title.trim()) {
      alert('O título da tarefa não pode ser vazio.');
      return;
    }

    this.taskService.updateTask(this.editingTask.id!, this.editingTask).subscribe({
      next: () => {

        const index = this.tasks.findIndex(t => t.id === this.editingTask!.id);
        if (index !== -1) {
          this.tasks[index] = this.editingTask!;
        }
        this.editingTask = null;
      },
      error: (err) => {
        console.error('Erro ao salvar edição da tarefa:', err);
        alert('Não foi possível salvar a edição da tarefa.');
      }
    });
  }

  cancelEdit(): void {
    this.editingTask = null; 
  }

  toggleCompleted(task: Task): void {
    const updatedTask = { ...task, completed: !task.completed };
    this.taskService.updateTask(updatedTask.id!, { completed: updatedTask.completed }).subscribe({
      next: () => {
        task.completed = updatedTask.completed;
      },
      error: (err) => {
        console.error('Erro ao atualizar status da tarefa:', err);
        alert('Não foi possível atualizar o status da tarefa.');
      }
    });
  }

  deleteTask(id: number | undefined): void {
    if (!id) return;
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
      return;
    }

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== id);
      },
      error: (err) => {
        console.error('Erro ao deletar tarefa:', err);
        alert('Não foi possível deletar a tarefa.');
      }
    });
  }
}