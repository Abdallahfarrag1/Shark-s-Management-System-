import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-staff-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col font-sans pb-16">
      <!-- Mobile Header -->
      <header class="bg-gray-900 text-white p-4 sticky top-0 z-50 shadow-md">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?q=80&w=1930&auto=format&fit=crop"
              loading="lazy"
              class="w-10 h-10 rounded-full border-2 border-secondary object-cover"
            />
            <div>
              <h1 class="font-bold text-sm">Ahmed Ali</h1>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                <span class="text-xs text-gray-400">Online</span>
              </div>
            </div>
          </div>
          <button class="text-gray-400 hover:text-white">🔔</button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 p-4">
        <router-outlet></router-outlet>
      </main>

      <!-- Bottom Navigation -->
      <nav
        class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex justify-around items-center z-50 pb-safe"
      >
        <a
          routerLink="/staff/dashboard"
          routerLinkActive="text-primary"
          class="flex flex-col items-center gap-1 text-gray-400 p-2"
        >
          <span class="text-xl">📅</span>
          <span class="text-[10px] font-medium">Schedule</span>
        </a>
        <a
          routerLink="/staff/queue"
          routerLinkActive="text-primary"
          class="flex flex-col items-center gap-1 text-gray-400 p-2"
        >
          <span class="text-xl">🚶</span>
          <span class="text-[10px] font-medium">Queue</span>
        </a>
        <a
          routerLink="/staff/profile"
          routerLinkActive="text-primary"
          class="flex flex-col items-center gap-1 text-gray-400 p-2"
        >
          <span class="text-xl">👤</span>
          <span class="text-[10px] font-medium">Profile</span>
        </a>
      </nav>
    </div>
  `,
})
export class StaffLayoutComponent {}
