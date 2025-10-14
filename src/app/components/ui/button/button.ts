import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dm-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html'
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' = 'button';
  @Input() variant: 'primary' | 'plain' = 'primary';
  @Input() disabled = false;

  @Output() clicked = new EventEmitter<MouseEvent>();

  get classes(): string {
    return this.variant === 'primary' ? 'btn-primary' : '';
  }
}
