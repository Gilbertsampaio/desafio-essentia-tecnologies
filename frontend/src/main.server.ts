import { bootstrapApplication } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { ApplicationConfig } from '@angular/core';

const serverConfig: ApplicationConfig = {
  providers: [
    ...appConfig.providers,
    provideServerRendering()
  ]
};

function bootstrap() {
  return bootstrapApplication(AppComponent, serverConfig);
}

export default bootstrap;