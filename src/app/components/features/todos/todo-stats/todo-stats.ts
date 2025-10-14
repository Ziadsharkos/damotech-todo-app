import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dm-todo-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-stats.html',
  styleUrls: ['./todo-stats.scss']
})
export class TodoStatsComponent {
  @Input() active = 0;
  @Input() completed = 0;
  @Input() total = 0;
  @Input() loading = false;
  @Input() showLive = false;
}
