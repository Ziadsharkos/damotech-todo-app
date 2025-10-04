import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Emits the current user (or null if logged out)
  user$: Observable<User | null>;

  constructor(private auth: Auth) {
    this.user$ = user(this.auth);
  }

  // Create a new user account
  async register(email: string, password: string): Promise<void> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Sign in existing user
  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Sign out current user
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Get current user snapshot
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}