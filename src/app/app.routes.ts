import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'todos', 
    loadComponent: () => import('./components/todo-list/todo-list').then(m => m.TodoListComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];