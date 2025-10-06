import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from '@angular/fire/firestore';
import { AuthService } from './auth';
import { Todo } from '../models/todo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  private get todosCollection() {
    return collection(this.firestore, 'todos');
  }

  // Get all todos for current user (real-time updates)
  getTodos(): Observable<Todo[]> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Query: Get only current user's todos, ordered by creation date
    const q = query(
      this.todosCollection,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    // Returns Observable that emits whenever data changes
    return collectionData(q, { idField: 'id' }) as Observable<Todo[]>;
  }

  // Create new todo
  async addTodo(title: string, description?: string): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const newTodo: Omit<Todo, 'id'> = {
      title,
      description,
      completed: false,
      userId: user.uid,
      createdAt: Timestamp.now().toDate(),
      updatedAt: Timestamp.now().toDate()
    };

    await addDoc(this.todosCollection, newTodo);
  }

  // Update existing todo
  async updateTodo(id: string, updates: Partial<Todo>): Promise<void> {
    const todoDoc = doc(this.firestore, `todos/${id}`);
    await updateDoc(todoDoc, {
      ...updates,
      updatedAt: Timestamp.now().toDate()
    });
  }

  // Toggle completed status
  async toggleComplete(id: string, completed: boolean): Promise<void> {
    await this.updateTodo(id, { completed });
  }

  // Delete todo
  async deleteTodo(id: string): Promise<void> {
    const todoDoc = doc(this.firestore, `todos/${id}`);
    await deleteDoc(todoDoc);
  }
}