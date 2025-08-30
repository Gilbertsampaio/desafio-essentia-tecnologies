import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
// Importe 'withInterceptorsFromDi' se você for usar interceptors baseados em classe.
// Para 'HttpInterceptorFn', usamos 'withInterceptors'.
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Importe seu authInterceptor aqui
import { authInterceptor } from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    // Registre seu interceptor aqui usando withInterceptors
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    importProvidersFrom(FormsModule, ReactiveFormsModule)
  ]
};