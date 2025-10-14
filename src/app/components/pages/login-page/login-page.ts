import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { CardComponent } from '../../ui/card/card';
import { HeaderComponent } from '../../shared/header/header';
import { LoginFormComponent } from '../../features/auth/login-form/login-form';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, CardComponent, HeaderComponent, LoginFormComponent],
  templateUrl: './login-page.html'
})
export class LoginPageComponent implements OnInit {
  loading = false;
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router, title: Title) {
    title.setTitle('Sign In - Damotech Task Manager');
  }

  ngOnInit() {
    this.auth.user$.subscribe(u => { if (u) this.router.navigate(['/todos']); });
  }

  async onLogin({ email, password }: { email: string; password: string; }) {
    this.errorMessage = '';
    if (!email || !password) { this.errorMessage = 'Email and password are required'; return; }
    this.loading = true;
    try {
      await this.auth.login(email, password);
      await this.auth.waitForAuthReady();
      this.router.navigate(['/todos']);
    } catch (e: any) {
      this.errorMessage = this.getErrorMessage(e?.code);
    } finally { this.loading = false; }
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential': return 'Invalid email or password';
      case 'auth/invalid-email': return 'Invalid email address';
      case 'auth/user-disabled': return 'This account has been disabled';
      case 'auth/too-many-requests': return 'Too many failed attempts. Please try again later.';
      default: return 'Login failed. Please try again.';
    }
  }
}
