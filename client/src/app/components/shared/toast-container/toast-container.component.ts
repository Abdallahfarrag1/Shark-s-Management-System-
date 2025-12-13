import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-md">
      @for (toast of toastService.toasts(); track toast.id) {
      <div
        class="toast slide-in-right shadow-xl"
        [ngClass]="{
          'toast-success': toast.type === 'success',
          'toast-error': toast.type === 'error',
          'toast-warning': toast.type === 'warning',
          'toast-info': toast.type === 'info'
        }"
      >
        <div class="flex items-start gap-3">
          <!-- Icon -->
          <div class="flex-shrink-0">
            @switch (toast.type) { @case ('success') {
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"
              />
            </svg>
            } @case ('error') {
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            } @case ('warning') {
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            } @case ('info') {
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              />
            </svg>
            } }
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm">{{ toast.title }}</p>
            <p class="text-sm opacity-90 mt-0.5">{{ toast.message }}</p>
          </div>

          <!-- Close Button -->
          <button
            (click)="toastService.dismiss(toast.id)"
            class="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .toast {
        @apply p-4 rounded-lg backdrop-blur-sm;
        min-width: 320px;
        max-width: 100%;
      }

      .toast-success {
        @apply bg-green-50 text-green-800 border border-green-200;
      }

      [data-theme='dark'] .toast-success {
        @apply bg-green-900 bg-opacity-30 text-green-200 border-green-700;
      }

      .toast-error {
        @apply bg-red-50 text-red-800 border border-red-200;
      }

      [data-theme='dark'] .toast-error {
        @apply bg-red-900 bg-opacity-30 text-red-200 border-red-700;
      }

      .toast-warning {
        @apply bg-yellow-50 text-yellow-800 border border-yellow-200;
      }

      [data-theme='dark'] .toast-warning {
        @apply bg-yellow-900 bg-opacity-30 text-yellow-200 border-yellow-700;
      }

      .toast-info {
        @apply bg-blue-50 text-blue-800 border border-blue-200;
      }

      [data-theme='dark'] .toast-info {
        @apply bg-blue-900 bg-opacity-30 text-blue-200 border-blue-700;
      }
    `,
  ],
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
