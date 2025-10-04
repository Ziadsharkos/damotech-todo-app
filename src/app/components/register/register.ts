import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit() {
    // Resets error message
    this.errorMessage = '';

    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'All fields are required';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    // Register user
    this.loading = true;
    try {
      await this.authService.register(this.email, this.password);
      // Navigate to todo list if success
      this.router.navigate(['/todos']);
    } catch (error: any) {
      this.errorMessage = this.getErrorMessage(error.code);
    } finally {
      this.loading = false;
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/weak-password':
        return 'Password is too weak';
      default:
        return 'Registration failed. Please try again.';
    }
  }
}