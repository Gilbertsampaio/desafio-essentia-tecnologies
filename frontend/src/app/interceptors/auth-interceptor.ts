import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Importa o AuthService

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Injeta o AuthService
  const authToken = authService.getToken(); // Obt�m o token do AuthService

  // Se houver um token, clona a requisi��o e adiciona o cabe�alho de autoriza��o
  if (authToken) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next(authReq);
  }

  // Se n�o houver token, passa a requisi��o original adiante
  return next(req);
};