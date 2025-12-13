import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      (click)="close()"
    >
      <div
        class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden"
        (click)="$event.stopPropagation()"
      >
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-lg font-semibold">{{ title }}</h3>
          <button (click)="close()" class="text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="p-4">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ModalComponent {
  @Input() title: string = '';
  @Output() closeEvent = new EventEmitter<void>();

  close() {
    this.closeEvent.emit();
  }
}
