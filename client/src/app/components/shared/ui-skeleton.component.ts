import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="'animate-pulse bg-gray-200 dark:bg-gray-700 rounded ' + className"
      [style.width]="width"
      [style.height]="height"
    ></div>
  `,
})
export class UiSkeletonComponent {
  @Input() width: string = '100%';
  @Input() height: string = '20px';
  @Input() className: string = '';
}
