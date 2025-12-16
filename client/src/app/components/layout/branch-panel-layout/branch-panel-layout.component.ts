import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { BranchService } from '../../../core/services/branch.service';

@Component({
  selector: 'app-branch-panel-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen flex" [attr.data-theme]="themeService.theme()">
      <!-- Mobile Sidebar Backdrop -->
      @if (isMobileSidebarOpen()) {
      <div
        class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        (click)="closeMobileSidebar()"
      ></div>
      }

      <!-- Sidebar -->
      <aside
        class="fixed md:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 flex flex-col transition-transform duration-300 md:translate-x-0"
        [class.-translate-x-full]="!isMobileSidebarOpen()"
        [style.background-color]="'var(--surface)'"
        [style.border-right]="'1px solid var(--border-light)'"
      >
        <!-- Logo -->
        <div
          class="h-16 flex items-center justify-between px-6"
          [style.border-bottom]="'1px solid var(--border-light)'"
        >
          <span
            class="text-2xl font-bold flex items-center gap-2"
            [style.color]="'var(--text-primary)'"
          >
            <span style="color: var(--color-primary-500)">✂</span> {{ branchName() }}
          </span>
          <button
            class="md:hidden text-gray-500 hover:text-gray-700"
            (click)="closeMobileSidebar()"
          >
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

        <!-- Navigation -->
        <nav class="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          <a
            routerLink="/branch-panel/bookings"
            routerLinkActive="nav-link-active"
            class="nav-link"
            (click)="closeMobileSidebar()"
          >
            <span class="mr-3">📅</span> {{ langService.t().bookings }}
          </a>
          <a
            routerLink="/branch-panel/queue"
            routerLinkActive="nav-link-active"
            class="nav-link"
            (click)="closeMobileSidebar()"
          >
            <span class="mr-3">🚶</span> {{ langService.t().queueSystem }}
          </a>
          <a
            routerLink="/branch-panel/surveys"
            routerLinkActive="nav-link-active"
            class="nav-link"
            (click)="closeMobileSidebar()"
          >
            <span class="mr-3">📝</span> Surveys
          </a>
        </nav>

        <!-- User Profile -->
        <div class="p-4" [style.border-top]="'1px solid var(--border-light)'">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
              style="background: var(--color-primary-500)"
            >
              BP
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate" [style.color]="'var(--text-primary)'">
                Branch User
              </p>
              <p class="text-xs truncate" [style.color]="'var(--text-tertiary)'">Branch Panel</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div
        class="flex-1 flex flex-col overflow-hidden min-w-0"
        [style.background-color]="'var(--bg-secondary)'"
      >
        <!-- Header -->
        <header
          class="h-16 flex items-center justify-between px-4 md:px-6 z-10 shadow-sm"
          [style.background-color]="'var(--surface)'"
          [style.border-bottom]="'1px solid var(--border-light)'"
        >
          <div class="flex items-center gap-4">
            <button
              class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              (click)="toggleMobileSidebar()"
              [style.color]="'var(--text-secondary)'"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 class="text-lg md:text-xl font-semibold" [style.color]="'var(--text-primary)'">
              {{ branchName() }}
            </h1>
          </div>

          <div class="flex items-center gap-2 md:gap-4">
            <!-- Theme Toggle -->
            <button
              (click)="themeService.toggleTheme()"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              [style.color]="'var(--text-secondary)'"
              title="Toggle theme"
            >
              @if (themeService.isDark()) {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              } @else {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
              }
            </button>

            <!-- Language Toggle -->
            <button
              (click)="langService.toggleLanguage()"
              class="text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              [style.color]="'var(--text-secondary)'"
            >
              {{ langService.currentLang() === 'en' ? 'العربية' : 'English' }}
            </button>

            <!-- Exit -->
            <a
              routerLink="/"
              class="text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              [style.color]="'var(--text-secondary)'"
            >
              {{ langService.t().exit }}
            </a>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto custom-scrollbar">
          <div class="p-4 md:p-6">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .nav-link {
        display: flex;
        align-items: center;
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        font-weight: 500;
        border-radius: 0.375rem;
        transition: all 0.2s;
        color: var(--text-secondary);
      }

      .nav-link:hover {
        background-color: var(--bg-tertiary);
        color: var(--text-primary);
      }

      .nav-link-active {
        background-color: var(--color-primary-500);
        color: white !important;
      }

      .nav-link-active:hover {
        background-color: var(--color-primary-600);
      }
    `,
  ],
})
export class BranchPanelLayoutComponent implements OnInit {
  langService = inject(LanguageService);
  themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private branchService = inject(BranchService);

  isMobileSidebarOpen = signal(false);
  branchName = signal('Branch Panel');

  ngOnInit() {
    this.loadBranchName();
  }

  loadBranchName() {
    const branchId = this.authService.managedBranchId;
    if (branchId) {
      this.branchService.getAllBranches().subscribe({
        next: (branches) => {
          const branch = branches.find((b) => b.id === branchId);
          if (branch) {
            this.branchName.set(branch.name);
          }
        },
        error: (error) => console.error('Error loading branch name:', error),
      });
    }
  }

  toggleMobileSidebar() {
    this.isMobileSidebarOpen.update((v) => !v);
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen.set(false);
  }
}
