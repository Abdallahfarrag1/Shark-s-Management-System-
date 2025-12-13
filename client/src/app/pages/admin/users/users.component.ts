import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../core/services/toast.service';
import { LanguageService } from '../../../core/services/language.service';

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roles: string[];
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold" [style.color]="'var(--text-primary)'">
            {{ langService.t().usersManagement }}
          </h1>
          <p class="text-sm md:text-base mt-1" [style.color]="'var(--text-secondary)'">
            {{ langService.t().viewManageUsers }}
          </p>
        </div>
      </div>

      <!-- Users List -->
      <div class="card">
        <div
          class="p-4 md:p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          [style.border-color]="'var(--border-light)'"
        >
          <h2 class="text-lg font-semibold" [style.color]="'var(--text-primary)'">
            {{ langService.t().allUsers }}
          </h2>
          <!-- Search Input -->
          <input
            type="text"
            [(ngModel)]="searchTerm"
            [placeholder]="langService.t().search + '...'"
            class="input text-sm py-2 px-3 w-full sm:w-64"
          />
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead
              class="border-b"
              [style.border-color]="'var(--border-light)'"
              [style.background-color]="'var(--bg-tertiary)'"
            >
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  {{ langService.t().name }}
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  {{ langService.t().email }}
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  {{ langService.t().phone }}
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium uppercase"
                  [style.color]="'var(--text-tertiary)'"
                >
                  {{ langService.t().roles }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y" [style.divide-color]="'var(--border-light)'">
              @if (isLoading()) {
              <tr>
                <td colspan="4" class="px-4 py-8 text-center">
                  <div class="flex justify-center">
                    <div
                      class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
                    ></div>
                  </div>
                </td>
              </tr>
              } @else if (users().length === 0) {
              <tr>
                <td
                  colspan="4"
                  class="px-4 py-8 text-center"
                  [style.color]="'var(--text-secondary)'"
                >
                  {{ langService.t().noUsersFound }}
                </td>
              </tr>
              } @else { @for (user of filteredUsers(); track user.id) {
              <tr
                class="hover:bg-opacity-50 dark:hover:bg-opacity-50 transition-colors"
                style="hover:background-color: var(--bg-tertiary)"
              >
                <td class="px-4 py-3 text-sm font-medium" [style.color]="'var(--text-primary)'">
                  {{ user.firstName }} {{ user.lastName }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ user.email }}
                </td>
                <td class="px-4 py-3 text-sm" [style.color]="'var(--text-secondary)'">
                  {{ user.phoneNumber }}
                </td>
                <td class="px-4 py-3">
                  <div class="flex flex-wrap gap-1">
                    @for (role of user.roles; track role) {
                    <span
                      class="badge"
                      [class.badge-success]="role === 'Admin'"
                      [class.badge-warning]="role === 'BranchManager'"
                      [class.badge-info]="role === 'Customer'"
                    >
                      {{ role }}
                    </span>
                    }
                  </div>
                </td>
              </tr>
              } }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class UsersComponent implements OnInit {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  langService = inject(LanguageService);

  users = signal<UserDto[]>([]);
  isLoading = signal(true);
  searchTerm = signal('');

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.users();
    return this.users().filter(
      (u) =>
        (u.firstName + ' ' + u.lastName).toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading.set(true);
    this.http.get<UserDto[]>(`${environment.apiUrl}/Users/non-admin`).subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.toastService.error('Error', 'Failed to load users');
        this.isLoading.set(false);
      },
    });
  }
}
