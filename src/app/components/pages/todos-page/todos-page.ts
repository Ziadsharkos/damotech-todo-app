import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { TodoService } from '../../../services/todo';
import { AuthService } from '../../../services/auth';
import { CloudFunctionsService, TaskStats } from '../../../services/cloud-functions';
import { Todo } from '../../../models/todo';

import { HeaderComponent } from '../../shared/header/header';
import { TodoStatsComponent } from '../../features/todos/todo-stats/todo-stats';
import { TodoFormComponent } from '../../features/todos/todo-form/todo-form';
import { TodoFiltersComponent, FilterType } from '../../features/todos/todo-filters/todo-filters';
import { TodoItemComponent } from '../../features/todos/todo-item/todo-item';

@Component({
  selector: 'app-todos-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    TodoStatsComponent,
    TodoFormComponent,
    TodoFiltersComponent,
    TodoItemComponent
  ],
  templateUrl: './todos-page.html',
  styleUrls: ['./todos-page.scss']
})
export class TodosPageComponent implements OnInit, OnDestroy {
  private todoService = inject(TodoService);
  private authService = inject(AuthService);
  private cloudFunctionsService = inject(CloudFunctionsService);
  private router = inject(Router);

  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  filter: FilterType = 'all';
  loading = false;
  taskStats: TaskStats | null = null;
  statsLoading = false;
  private todosSubscription?: Subscription;

  constructor(title: Title) {
    title.setTitle('My Tasks - Damotech Task Manager');
  }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.loadTodos();
        this.loadStats();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy() {
    this.todosSubscription?.unsubscribe();
  }

  loadTodos() {
    this.loading = true;
    this.todosSubscription = this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.applyFilter();
        this.loading = false;
        this.loadStats();
      },
      error: (error) => {
        console.error('Error loading todos:', error);
        this.loading = false;
      }
    });
  }

  async loadStats() {
    this.statsLoading = true;
    try {
      this.taskStats = await this.cloudFunctionsService.getTaskStats();
    } catch (error) {
      this.taskStats = {
        total: this.todos.length,
        active: this.activeCount,
        completed: this.completedCount,
        userId: this.authService.getCurrentUser()?.uid || '',
        timestamp: new Date().toISOString()
      };
    } finally {
      this.statsLoading = false;
    }
  }

  async addTodo(evt: { title: string; description?: string }) {
    try {
      await this.todoService.addTodo(evt.title, evt.description);
    } catch (error) {
      console.error('Error adding todo:', error);
      alert('Failed to add task. Please try again.');
    }
  }

  async onToggle(todo: Todo) {
    if (!todo.id) return;
    try { await this.todoService.toggleComplete(todo.id, !todo.completed); }
    catch (error) { console.error('Error updating todo:', error); alert('Failed to update task. Please try again.'); }
  }

  async onDelete(todo: Todo) {
    if (!todo.id) return;
    if (confirm(`Delete "${todo.title}"?`)) {
      try { await this.todoService.deleteTodo(todo.id); }
      catch (error) { console.error('Error deleting todo:', error); alert('Failed to delete task. Please try again.'); }
    }
  }

  setFilter(f: FilterType) { this.filter = f; this.applyFilter(); }

  applyFilter() {
    switch (this.filter) {
      case 'active': this.filteredTodos = this.todos.filter(t => !t.completed); break;
      case 'completed': this.filteredTodos = this.todos.filter(t => t.completed); break;
      default: this.filteredTodos = this.todos;
    }
  }

  async logout() {
    try { await this.authService.logout(); this.router.navigate(['/login']); }
    catch (error) { console.error('Logout error:', error); }
  }

  get activeCount(): number { return this.todos.filter(t => !t.completed).length; }
  get completedCount(): number { return this.todos.filter(t => t.completed).length; }
}
