import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser'
import { Subscription } from 'rxjs';
import { TodoService } from '../../services/todo';
import { AuthService } from '../../services/auth';
import { Todo } from '../../models/todo';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.scss'
})
export class TodoListComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  newTodoTitle = '';
  newTodoDescription = '';
  filter: 'all' | 'active' | 'completed' = 'all';
  loading = false;
  private todosSubscription?: Subscription;

  constructor(
    private todoService: TodoService,
    private authService: AuthService,
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle('My Tasks - Damotech Task Manager');
  }

  ngOnInit() {
    // Wait for auth state to be ready before loading todos
    this.authService.user$.subscribe(user => {
      if (user) {
        console.log('User authenticated, loading todos');
        this.loadTodos();
      } else {
        console.log('No user, redirecting to login');
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
        console.log('Todos loaded:', todos);
        this.todos = todos;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading todos:', error);
        this.loading = false;
      }
    });
  }

  async addTodo() {
    if (!this.newTodoTitle.trim()) {
      return;
    }

    this.loading = true;
    try {
      await this.todoService.addTodo(
        this.newTodoTitle.trim(),
        this.newTodoDescription.trim() || undefined
      );
      // Clear form
      this.newTodoTitle = '';
      this.newTodoDescription = '';
    } catch (error) {
      console.error('Error adding todo:', error);
      alert('Failed to add task. Please try again.');
    } finally {
      this.loading = false;
    }
  }

  async toggleComplete(todo: Todo) {
    if (!todo.id) return;
    
    try {
      await this.todoService.toggleComplete(todo.id, !todo.completed);
    } catch (error) {
      console.error('Error updating todo:', error);
      alert('Failed to update task. Please try again.');
    }
  }

  async deleteTodo(todo: Todo) {
    if (!todo.id) return;

    if (confirm(`Delete "${todo.title}"?`)) {
      try {
        await this.todoService.deleteTodo(todo.id);
      } catch (error) {
        console.error('Error deleting todo:', error);
        alert('Failed to delete task. Please try again.');
      }
    }
  }

  setFilter(filter: 'all' | 'active' | 'completed') {
    this.filter = filter;
    this.applyFilter();
  }

  applyFilter() {
    switch (this.filter) {
      case 'active':
        this.filteredTodos = this.todos.filter(t => !t.completed);
        break;
      case 'completed':
        this.filteredTodos = this.todos.filter(t => t.completed);
        break;
      default:
        this.filteredTodos = this.todos;
    }
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  get activeCount(): number {
    return this.todos.filter(t => !t.completed).length;
  }

  get completedCount(): number {
    return this.todos.filter(t => t.completed).length;
  }

    getDate(timestamp: any): Date {
    if (timestamp?.toDate && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    if (timestamp instanceof Date) {
      return timestamp;
    }
    // Fallback to current date
    return new Date();
  }
}