import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Todo } from '../../../../models/todo';

@Component({
  selector: 'dm-todo-item',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './todo-item.html',
  styleUrls: ['./todo-item.scss']
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() toggle = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  asDate(ts: any): Date {
    if (ts?.toDate && typeof ts.toDate === 'function') return ts.toDate();
    if (ts instanceof Date) return ts;
    return new Date();
  }
}
