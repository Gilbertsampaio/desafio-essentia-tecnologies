import { bootstrapApplication } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server'; // Importa??o principal
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { ApplicationConfig } from '@angular/core';

const serverConfig: ApplicationConfig = {
  providers: [
    ...appConfig.providers,
    provideServerRendering() // <--- Deve ser a ?nica chamada para isso aqui
  ]
};

export default async function server(): Promise<any> {
  return await bootstrapApplication(AppComponent, serverConfig);
}