import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BranchService, BranchExtended } from '../../../core/services/branch.service';
import { LanguageService } from '../../../core/services/language.service';
import { UiSkeletonComponent } from '../../../components/shared/ui-skeleton.component';
import { UiInputComponent } from '../../../components/shared/ui-input.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-branch-list',
  standalone: true,
  imports: [CommonModule, RouterLink, UiInputComponent, UiSkeletonComponent, ReactiveFormsModule],
  template: `
    <div class="bg-white min-h-screen w-full">
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-8">{{ t().findBranch }}</h1>

        <!-- Search & Filter -->
        <div class="mb-8">
          <app-ui-input
            [formControl]="searchControl"
            [placeholder]="t().searchPlaceholder"
            class="max-w-md"
          >
            <span icon class="text-gray-400">🔍</span>
          </app-ui-input>
        </div>

        <!-- Branch List -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @if (isLoading()) { @for (item of [1, 2, 3, 4, 5, 6]; track item) {
          <div class="h-80 rounded-3xl overflow-hidden shadow-xl bg-white border border-gray-100">
            <app-ui-skeleton height="100%" width="100%"></app-ui-skeleton>
          </div>
          } } @else { @for (branch of filteredBranches(); track branch.id) {
          <div
            [routerLink]="['/branches', branch.id]"
            class="group relative h-80 rounded-3xl overflow-hidden shadow-xl cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <!-- Background Image -->
            <img
              [src]="branch.image || defaultBranchImage"
              loading="lazy"
              [alt]="branch.name"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <!-- Gradient Overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"
            ></div>

            <!-- Top Badges -->
            <div class="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
              <!-- Rating Badge -->
              @if (branch.rating) {
              <div
                class="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10"
              >
                <span class="text-yellow-400 text-sm">★</span>
                <span class="text-white text-sm font-bold">{{ branch.rating }}</span>
                <span class="text-white/70 text-xs">({{ branch.reviewCount || 0 }})</span>
              </div>
              }

              <!-- Status Badge REMOVED -->
            </div>

            <!-- Bottom Content -->
            <div
              class="absolute bottom-0 left-0 right-0 p-6 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
            >
              <h3 class="text-2xl font-bold text-white mb-2 leading-tight">
                {{ branch.name }}
              </h3>

              <div class="flex items-center gap-2 text-gray-300 mb-4 text-sm">
                <span>📍</span>
                <span class="truncate">{{ branch.location }}</span>
              </div>

              <div
                class="flex items-center justify-between pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75"
              >
                <div class="flex flex-col">
                  <span class="text-xs text-gray-400 uppercase tracking-wider">Hours</span>
                  <span class="text-sm text-white font-medium">{{
                    branch.hours || '10:00 AM - 2:00 AM'
                  }}</span>
                </div>

                <span
                  class="flex items-center gap-2 text-primary-400 font-semibold text-sm group-hover:translate-x-1 transition-transform"
                >
                  {{ t().viewDetails }}
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
          } @empty {
          <div class="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div class="text-6xl mb-4">🔍</div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {{ t().noBranchesFound }}
            </h3>
            <p class="text-gray-500 dark:text-gray-400">Try adjusting your search criteria</p>
          </div>
          } }
        </div>
      </div>
    </div>
  `,
})
export class BranchListComponent implements OnInit {
  branchService = inject(BranchService);
  private languageService = inject(LanguageService);
  t = this.languageService.t;

  // Default branch image
  readonly defaultBranchImage =
    'https://png.pngtree.com/background/20250116/original/pngtree-modern-barbershop-interior-with-empty-black-chairs-wooden-walls-and-mirrors-picture-image_16212968.jpg';

  searchControl = new FormControl('');

  filteredBranches = computed(() => {
    const query = this.searchControl.value?.toLowerCase() || '';
    return this.branchService
      .branches()
      .filter(
        (b: BranchExtended) =>
          b.name.toLowerCase().includes(query) || b.location.toLowerCase().includes(query)
      );
  });

  isLoading = signal(true);

  ngOnInit() {
    this.branchService.getAllBranches().subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load branches:', err);
        this.isLoading.set(false);
      },
    });
  }

  constructor() {
    this.searchControl.valueChanges.subscribe(() => {
      // Trigger change detection if needed, but computed handles it
    });
  }
}
