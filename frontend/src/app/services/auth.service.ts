import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { IAuthResponse } from '../interfaces/auth-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private userNameSubject = new BehaviorSubject<string>('');
  userName$ = this.userNameSubject.asObservable();

  private readonly AUTH_API_URL = 'http://localhost:3000/api/auth';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.checkInitialAuthStatus();
  }

  private checkInitialAuthStatus(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      const userName = localStorage.getItem('user_name');
      if (token) {
        this.isAuthenticatedSubject.next(true);
        if (userName) {
          this.userNameSubject.next(userName);
        }
      }
    }
  }

  login(username: string, password: string): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.AUTH_API_URL}/login`, { username, password }).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user_name', username);
        }
        this.isAuthenticatedSubject.next(true);
        this.userNameSubject.next(username);
      }),
      catchError(error => {
        console.error('Erro de login:', error);
        this.logout();
        return throwError(() => new Error('Login failed.'));
      })
    );
  }

  register(username: string, password: string): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.AUTH_API_URL}/register`, { username, password }).pipe(
      tap(response => {
        this.login(username, password);
      }),
      catchError(error => {
        console.error('Erro de registro:', error);
        return throwError(() => new Error('Registration failed.'));
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_name');
    }
    this.isAuthenticatedSubject.next(false);
    this.userNameSubject.next('');
  }

  public getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  public getUserName(): string {
    return this.userNameSubject.getValue();
  }
}
