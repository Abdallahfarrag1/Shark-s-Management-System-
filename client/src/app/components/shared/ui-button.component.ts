import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button [type]="type()" [disabled]="disabled()" [class]="classes()" (click)="onClick($event)">
      <ng-content></ng-content>
    </button>
  `,
})
export class UiButtonComponent {
  variant = input<'primary' | 'secondary' | 'outline' | 'ghost'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  disabled = input(false);
  type = input<'button' | 'submit' | 'reset'>('button');
  fullWidth = input(false);

  classes = computed(() => {
    const base =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-primary text-white hover:bg-gray-800',
      secondary: 'bg-secondary text-white hover:bg-yellow-600',
      outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700',
      ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return `${base} ${variants[this.variant()]} ${sizes[this.size()]} ${
      this.fullWidth() ? 'w-full' : ''
    }`;
  });

  onClick(event: MouseEvent) {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
