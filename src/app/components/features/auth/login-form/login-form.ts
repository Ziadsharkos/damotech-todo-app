import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../ui/button/button';
import { InputFieldComponent } from '../../../ui/input-field/input-field';

@Component({
  selector: 'dm-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonComponent, InputFieldComponent],
  templateUrl: './login-form.html'
})
export class LoginFormComponent {
  @Input() loading = false;
  @Input() errorMessage = '';
  @Output() login = new EventEmitter<{ email: string; password: string }>();

  email = '';
  password = '';

  submit() {
    this.login.emit({ email: this.email, password: this.password });
  }
}
