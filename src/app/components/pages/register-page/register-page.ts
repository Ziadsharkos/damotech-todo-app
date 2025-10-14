import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { CardComponent } from '../../ui/card/card';
import { HeaderComponent } from '../../shared/header/header';
import { RegisterFormComponent } from '../../features/auth/register-form/register-form';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, CardComponent, HeaderComponent, RegisterFormComponent],
  templateUrl: './register-page.html'
})
export class RegisterPageComponent {
  loading = false;
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router, title: Title) {
    title.setTitle('Create Account - Damotech Task Manager');
  }

  async onRegister({ email, password, confirmPassword }:
    { email: string; password: string; confirmPassword: string; }) {
    this.errorMessage = '';
    if (!email || !password || !confirmPassword) { this.errorMessage = 'All fields are required'; return; }
    if (password !== confirmPassword) { this.errorMessage = 'Passwords do not match'; return; }
    if (password.length < 6) { this.errorMessage = 'Password must be at least 6 characters'; return; }

    this.loading = true;
    try {
      await this.auth.register(email, password);
      setTimeout(() => this.router.navigate(['/todos']), 100);
    } catch (e: any) {
      this.errorMessage = this.getErrorMessage(e?.code);
    } finally { this.loading = false; }
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use': return 'This email is already registered';
      case 'auth/invalid-email': return 'Invalid email address';
      case 'auth/weak-password': return 'Password is too weak';
      default: return 'Registration failed. Please try again.';
    }
  }
}
