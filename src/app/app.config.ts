// app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideHttpClient } from '@angular/common/http';
import { provideFunctions, getFunctions } from '@angular/fire/functions';

import {
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    provideAuth(() => {
      const auth = getAuth();
      if (typeof window !== 'undefined') {
        setPersistence(auth, browserLocalPersistence);
        // If you want a more robust fallback chain, you can do:
        // setPersistence(auth, indexedDBLocalPersistence).catch(() =>
        //   setPersistence(auth, browserLocalPersistence)
        // );
      }
      return auth;
    }),

    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
  ],
};
