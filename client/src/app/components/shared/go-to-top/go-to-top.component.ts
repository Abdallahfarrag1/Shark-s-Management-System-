import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-go-to-top',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class.opacity-100]="isVisible()"
      [class.opacity-0]="!isVisible()"
      [class.pointer-events-auto]="isVisible()"
      [class.pointer-events-none]="!isVisible()"
      [class.translate-y-0]="isVisible()"
      [class.translate-y-10]="!isVisible()"
      (click)="scrollToTop()"
      class="fixed bottom-8 right-8 z-50 bg-secondary text-black p-4 rounded-full shadow-2xl shadow-yellow-500/30 transform transition-all duration-300 hover:scale-110 hover:bg-white focus:outline-none"
      aria-label="Go to top"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="3"
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  `,
  styles: [],
})
export class GoToTopComponent {
  isVisible = signal(false);

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isVisible.set(window.scrollY > 300);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
