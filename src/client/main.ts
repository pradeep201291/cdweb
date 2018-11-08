import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import './../assets/styles/reset.css';


import { AppModule } from './app/app.module';

if (process.env.ENV === 'prod') {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
