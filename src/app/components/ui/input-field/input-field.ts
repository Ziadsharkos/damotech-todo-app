import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

let autoId = 0;

@Component({
  selector: 'dm-input-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-field.html'
})
export class InputFieldComponent {
  @Input() label = '';
  @Input() name = '';
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() minlength?: number;
  @Input() model = '';

  @Output() modelChange = new EventEmitter<string>();
  @Output() enter = new EventEmitter<string>();

  id = `dm-input-${++autoId}`;
}
