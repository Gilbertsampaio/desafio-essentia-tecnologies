// frontend/src/app/interfaces/task.interface.ts
export interface ITask {
  id: number | undefined; // O id pode ser undefined ao criar uma nova tarefa
  title: string;
  description?: string; // Opcional
  completed: boolean;
  created_at: string; // A API retorna a data como uma string
}
