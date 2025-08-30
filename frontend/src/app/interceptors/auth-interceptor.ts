import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Importa o AuthService

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Injeta o AuthService
  const authToken = authService.getToken(); // Obtém o token do AuthService

  // Se houver um token, clona a requisição e adiciona o cabeçalho de autorização
  if (authToken) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next(authReq);
  }

  // Se não houver token, passa a requisição original adiante
  return next(req);
};