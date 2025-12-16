import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

import { FooterComponent } from '../footer/footer.component';
import { GoToTopComponent } from '../../shared/go-to-top/go-to-top.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    FooterComponent,
    GoToTopComponent,
  ],
  template: `
    <div
      class="min-h-screen flex flex-col font-sans overflow-x-hidden"
      [dir]="langService.currentLang() === 'ar' ? 'rtl' : 'ltr'"
    >
      <!-- Header -->
      <header class="bg-white shadow-sm sticky top-0 z-50">
        <nav class="container mx-auto px-4 h-16 flex items-center justify-between">
          <!-- Logo -->
          <a routerLink="/" class="text-2xl font-bold text-primary flex items-center gap-2">
            <img src="assets/logo.png" alt="Sharks Logo" class="h-10 w-auto object-contain" />
            <span class="text-primary-600">Sharks</span>
          </a>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-8">
            <a
              routerLink="/branches"
              routerLinkActive="text-secondary"
              class="text-gray-600 hover:text-primary font-medium transition-colors"
              >{{ t().branches }}</a
            >
            <a
              routerLink="/store"
              routerLinkActive="text-secondary"
              class="text-gray-600 hover:text-primary font-medium transition-colors"
              >{{ t().store }}</a
            >
            <a
              routerLink="/hairstyle-recommender"
              routerLinkActive="text-secondary"
              class="text-gray-600 hover:text-primary font-medium transition-colors flex items-center gap-1"
            >
              (AI) {{ t().tryHaircut }}
            </a>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 md:gap-4">
            <!-- Cart Icon -->
            <a
              routerLink="/cart"
              class="relative text-gray-600 hover:text-primary transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              @if (cartService.totalItems() > 0) {
              <span
                class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              >
                {{ cartService.totalItems() }}
              </span>
              }
            </a>
            <button
              (click)="langService.toggleLanguage()"
              class="text-sm font-medium text-gray-600 hover:text-primary"
            >
              {{ langService.currentLang() === 'en' ? 'العربية' : 'English' }}
            </button>

            @if (authService.isAuthenticated) {
            <!-- Role-based navigation buttons -->
            <div class="hidden md:flex items-center gap-2">
              @if (authService.isAdmin) {
              <a
                routerLink="/admin"
                class="text-sm bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition"
                >Admin Panel</a
              >
              } @if (authService.isBranchManager) {
              <a
                routerLink="/branch-panel"
                class="text-sm bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition"
                >Branch Panel</a
              >
              } @if (authService.isBarber) {
              <a
                routerLink="/staff"
                class="text-sm bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 transition"
                >Barber Dashboard</a
              >
              }
            </div>

            <div class="relative group hidden md:block">
              <button class="flex items-center gap-2 text-gray-700 hover:text-primary font-medium">
                <span>{{ authService.firstName }}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              <!-- Dropdown -->
              <div
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
              >
                <a
                  routerLink="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >{{ t().profile }}</a
                >
                <a
                  routerLink="/my-history"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >My History</a
                >
                <button
                  (click)="authService.logout()"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  {{ t().logout }}
                </button>
              </div>
            </div>
            } @else {
            <a
              routerLink="/auth/login"
              class="hidden md:block bg-primary text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              {{ t().signIn }}
            </a>
            }
            <!-- Mobile Menu Button -->
            <button class="md:hidden text-gray-600" (click)="toggleMobileMenu()">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </nav>

        <!-- Mobile Navigation Menu -->
        @if (isMobileMenuOpen) {
        <div
          class="md:hidden border-t border-gray-100 absolute top-16 left-0 right-0 bg-white shadow-lg z-40"
        >
          <div class="flex flex-col p-4 gap-4">
            <a
              routerLink="/branches"
              routerLinkActive="text-secondary"
              class="text-gray-600 hover:text-primary font-medium transition-colors"
              (click)="toggleMobileMenu()"
              >{{ t().branches }}</a
            >
            <a
              routerLink="/store"
              routerLinkActive="text-secondary"
              class="text-gray-600 hover:text-primary font-medium transition-colors"
              (click)="toggleMobileMenu()"
              >{{ t().store }}</a
            >
            <a
              routerLink="/hairstyle-recommender"
              routerLinkActive="text-secondary"
              class="text-gray-600 hover:text-primary font-medium transition-colors flex items-center gap-1"
              (click)="toggleMobileMenu()"
            >
              (AI) {{ t().tryHaircut }}
            </a>

            @if (authService.isAuthenticated) {
            <div class="border-t border-gray-100 pt-4 flex flex-col gap-3">
              <!-- Role Links -->
              @if (authService.isAdmin) {
              <a
                routerLink="/admin"
                class="text-red-500 font-medium hover:text-red-600"
                (click)="toggleMobileMenu()"
                >Admin Panel</a
              >
              } @if (authService.isBranchManager) {
              <a
                routerLink="/branch-panel"
                class="text-blue-500 font-medium hover:text-blue-600"
                (click)="toggleMobileMenu()"
                >Branch Panel</a
              >
              } @if (authService.isBarber) {
              <a
                routerLink="/staff"
                class="text-green-500 font-medium hover:text-green-600"
                (click)="toggleMobileMenu()"
                >Barber Dashboard</a
              >
              }

              <!-- User Links -->
              <a
                routerLink="/profile"
                class="text-gray-600 hover:text-primary font-medium"
                (click)="toggleMobileMenu()"
                >{{ t().profile }}</a
              >
              <a
                routerLink="/my-history"
                class="text-gray-600 hover:text-primary font-medium"
                (click)="toggleMobileMenu()"
                >My History</a
              >
              <button
                (click)="authService.logout(); toggleMobileMenu()"
                class="text-left text-red-600 font-medium hover:text-red-700"
              >
                {{ t().logout }}
              </button>
            </div>
            } @else {
            <a
              routerLink="/auth/login"
              class="bg-primary text-center text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              (click)="toggleMobileMenu()"
            >
              {{ t().signIn }}
            </a>
            }
          </div>
        </div>
        }
      </header>

      <!-- Main Content -->
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <app-footer></app-footer>

      <!-- Go To Top Button -->
      <app-go-to-top></app-go-to-top>
    </div>
  `,
})
export class MainLayoutComponent {
  langService = inject(LanguageService);
  authService = inject(AuthService);
  cartService = inject(CartService);
  t = this.langService.t;

  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
