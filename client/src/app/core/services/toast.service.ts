import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // in milliseconds, 0 = no auto-dismiss
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = signal<Toast[]>([]);
  private idCounter = 0;

  show(toast: Omit<Toast, 'id'>): void {
    const id = `toast-${++this.idCounter}`;
    const newToast: Toast = { ...toast, id };

    this.toasts.update((toasts) => [...toasts, newToast]);

    // Auto-dismiss if duration is set
    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  success(title: string, message: string, duration?: number): void {
    this.show({ type: 'success', title, message, duration });
  }

  error(title: string, message: string, duration?: number): void {
    this.show({ type: 'error', title, message, duration });
  }

  warning(title: string, message: string, duration?: number): void {
    this.show({ type: 'warning', title, message, duration });
  }

  info(title: string, message: string, duration?: number): void {
    this.show({ type: 'info', title, message, duration });
  }

  dismiss(id: string): void {
    this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }
}
