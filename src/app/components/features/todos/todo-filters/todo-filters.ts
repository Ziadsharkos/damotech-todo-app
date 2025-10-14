import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FilterType = 'all' | 'active' | 'completed';

@Component({
  selector: 'dm-todo-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-filters.html',
  styleUrls: ['./todo-filters.scss']
})
export class TodoFiltersComponent {
  @Input() value: FilterType = 'all';
  @Output() change = new EventEmitter<FilterType>();
  select(v: FilterType) { this.change.emit(v); }
}
