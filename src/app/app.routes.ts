import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./components/pages/login-page/login-page').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/pages/register-page/register-page').then(
        (m) => m.RegisterPageComponent
      ),
  },
  {
    path: 'todos',
    loadComponent: () =>
      import('./components/pages/todos-page/todos-page').then(
        (m) => m.TodosPageComponent
      ),
    canActivate: [authGuard],
  },

  { path: '**', redirectTo: '/login' },
];
