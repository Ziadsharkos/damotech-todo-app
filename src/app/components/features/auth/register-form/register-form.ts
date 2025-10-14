import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../ui/button/button';
import { InputFieldComponent } from '../../../ui/input-field/input-field';

@Component({
  selector: 'dm-register-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonComponent, InputFieldComponent],
  templateUrl: './register-form.html'
})
export class RegisterFormComponent {
  @Input() loading = false;
  @Input() errorMessage = '';
  @Output() register = new EventEmitter<{ email: string; password: string; confirmPassword: string }>();

  email = '';
  password = '';
  confirmPassword = '';

  submit() {
    this.register.emit({ email: this.email, password: this.password, confirmPassword: this.confirmPassword });
  }
}
