import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen) {
    <div class="modal-backdrop fade-in" (click)="onBackdropClick()">
      <div class="modal w-full max-w-md p-6 slide-in-up" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                class="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Delete {{ entityType }}</h3>
              <p class="text-sm text-gray-500">This action cannot be undone</p>
            </div>
          </div>
          <button (click)="close()" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="mb-6">
          <p class="text-gray-700 mb-4">
            To confirm deletion, please type
            <strong class="font-mono text-red-600">delete {{ entityName }}</strong> below:
          </p>

          <input
            type="text"
            [(ngModel)]="confirmationText"
            (keyup.enter)="onConfirm()"
            placeholder="Type here..."
            class="input"
            [class.border-red-500]="showError"
            autofocus
          />

          @if (showError) {
          <p class="text-sm text-red-600 mt-2">
            ❌ Text doesn't match. Please type exactly:
            <span class="font-mono">delete {{ entityName }}</span>
          </p>
          }
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button (click)="close()" class="btn-outline flex-1">Cancel</button>
          <button
            (click)="onConfirm()"
            class="btn-danger flex-1"
            [disabled]="!isConfirmationValid()"
            [class.opacity-50]="!isConfirmationValid()"
            [class.cursor-not-allowed]="!isConfirmationValid()"
          >
            Delete {{ entityType }}
          </button>
        </div>
      </div>
    </div>
    }
  `,
  styles: [],
})
export class DeleteConfirmationModalComponent {
  @Input() isOpen: boolean = true;
  @Input() entityType: string = 'Item'; // e.g., 'Branch', 'Employee'
  @Input() entityName: string = ''; // e.g., 'Downtown Branch', 'John Doe'

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  confirmationText: string = '';
  showError: boolean = false;

  isConfirmationValid(): boolean {
    const expectedText = `delete ${this.entityName}`;
    return this.confirmationText.toLowerCase() === expectedText.toLowerCase();
  }

  onConfirm(): void {
    if (this.isConfirmationValid()) {
      this.confirmed.emit();
      this.reset();
    } else {
      this.showError = true;
      setTimeout(() => (this.showError = false), 3000);
    }
  }

  close(): void {
    this.cancelled.emit();
    this.reset();
  }

  onBackdropClick(): void {
    this.close();
  }

  private reset(): void {
    this.confirmationText = '';
    this.showError = false;
  }
}
