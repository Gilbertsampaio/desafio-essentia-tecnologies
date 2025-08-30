import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ITask } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/api/tasks';

  constructor(private http: HttpClient) { }

  getTasks(): Observable<ITask[]> {
    return this.http.get<ITask[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  addTask(task: Omit<ITask, 'id' | 'completed' | 'created_at'>): Observable<ITask> {
    const newTaskPayload = {
      title: task.title,
      description: task.description
    };
    return this.http.post<ITask>(this.apiUrl, newTaskPayload)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateTask(id: number, task: ITask): Observable<ITask> {
    return this.http.put<ITask>(`${this.apiUrl}/${id}`, task)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error.error.message || error.statusText);
    return throwError(() => new Error(error.error.message || 'Server error'));
  }
}
