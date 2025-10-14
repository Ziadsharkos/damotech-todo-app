import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'dm-todo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-form.html',
  styleUrls: ['./todo-form.scss']
})
export class TodoFormComponent {
  @Input() loading = false;
  @Output() add = new EventEmitter<{ title: string; description?: string }>();

  title = '';
  description = '';

  submit() {
    if (!this.title.trim()) return;
    this.add.emit({ title: this.title.trim(), description: this.description.trim() || undefined });
    this.title = '';
    this.description = '';
  }
}
