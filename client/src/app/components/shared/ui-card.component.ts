import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
      [class]="class()"
    >
      <ng-content></ng-content>
    </div>
  `,
})
export class UiCardComponent {
  class = input('');
}
