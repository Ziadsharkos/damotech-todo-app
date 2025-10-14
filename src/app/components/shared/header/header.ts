import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

type HeaderMode = 'brand' | 'todos';

@Component({
  selector: 'dm-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {
  @Input() mode: HeaderMode = 'brand';
  @Input() showLogout = false;

  @Output() logout = new EventEmitter<void>();
}
