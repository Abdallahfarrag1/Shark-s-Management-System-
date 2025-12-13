import { Component, inject, OnInit, signal, HostListener } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { RouterLink } from '@angular/router';

import { LanguageService } from '../../../core/services/language.service';
import { BranchService, BranchExtended } from '../../../core/services/branch.service';
import { UiSkeletonComponent } from '../../../components/shared/ui-skeleton.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, UiSkeletonComponent],
  template: `
    <!-- Hero Section -->
    <section class="relative min-h-[600px] flex items-center bg-black overflow-hidden">
      <!-- Background Image with Gradient Overlay -->
      <div class="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop"
          alt="Barber Shop"
          loading="eager"
          class="w-full h-full object-cover opacity-60"
        />
        <!-- Premium Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        <div
          class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
        ></div>
      </div>

      <!-- Content -->
      <div class="container mx-auto px-4 relative z-10 pt-20">
        <div class="max-w-3xl">
          <span
            class="inline-block py-1.5 px-4 rounded-full bg-secondary/20 border border-secondary/40 text-secondary text-sm font-bold tracking-wider uppercase mb-8 backdrop-blur-md"
          >
            {{ t().premiumBarberExperience }}
          </span>
          <h1
            class="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight font-serif tracking-tight"
          >
            {{ t().experienceArt }} <br />
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-yellow-200"
              >{{ t().masterfulGrooming }}</span
            >
          </h1>
          <p class="text-xl md:text-2xl text-gray-300 mb-10 max-w-xl leading-relaxed font-light">
            {{ t().heroSubtitle }}
          </p>
          <div class="flex flex-col sm:flex-row gap-5">
            <a
              routerLink="/branches"
              class="inline-flex items-center justify-center rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary w-full sm:w-auto bg-gradient-to-r from-secondary to-yellow-400 hover:from-yellow-400 hover:to-secondary text-black font-bold border-none shadow-[0_0_20px_rgba(212,175,55,0.4)] transform hover:scale-105 text-lg py-4 px-8"
            >
              {{ t().bookAppointment }}
            </a>
          </div>

          <!-- Quick Stats -->
          <div class="mt-16 flex gap-12 border-t border-white/10 pt-10">
            <div>
              <p class="text-4xl font-bold text-secondary font-serif">4.9</p>
              <p class="text-sm text-gray-400 uppercase tracking-widest mt-1">
                {{ t().averageRating }}
              </p>
            </div>
            <div>
              <p class="text-4xl font-bold text-secondary font-serif">15k+</p>
              <p class="text-sm text-gray-400 uppercase tracking-widest mt-1">
                {{ t().happyClients }}
              </p>
            </div>
            <div>
              <p class="text-4xl font-bold text-secondary font-serif">10+</p>
              <p class="text-sm text-gray-400 uppercase tracking-widest mt-1">
                {{ t().yearsExperience }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24 bg-black text-white relative">
      <!-- Decorative Elements -->
      <div
        class="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-zinc-900 to-transparent opacity-50 pointer-events-none"
      ></div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4 text-white font-serif">
            <span class="text-secondary">{{ t().whyChoose }}</span> Sharks
          </h2>
          <p class="text-gray-400 max-w-2xl mx-auto text-lg font-light">
            {{ t().whyChooseSubtitle }}
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div
            class="text-center p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-secondary/30 transition-all duration-300 hover:transform hover:-translate-y-2 group"
          >
            <div
              class="w-20 h-20 bg-black rounded-full border border-zinc-800 flex items-center justify-center mx-auto mb-6 text-4xl group-hover:border-secondary/50 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-300"
            >
              ✂️
            </div>
            <h3 class="text-xl font-bold mb-3 text-white">
              {{ t().expertBarbers }}
            </h3>
            <p class="text-gray-400 leading-relaxed">
              {{ t().expertBarbersDesc }}
            </p>
          </div>
          <div
            class="text-center p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-secondary/30 transition-all duration-300 hover:transform hover:-translate-y-2 group"
          >
            <div
              class="w-20 h-20 bg-black rounded-full border border-zinc-800 flex items-center justify-center mx-auto mb-6 text-4xl group-hover:border-secondary/50 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-300"
            >
              💺
            </div>
            <h3 class="text-xl font-bold mb-3 text-white">
              {{ t().premiumComfort }}
            </h3>
            <p class="text-gray-400 leading-relaxed">
              {{ t().premiumComfortDesc }}
            </p>
          </div>
          <div
            class="text-center p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-secondary/30 transition-all duration-300 hover:transform hover:-translate-y-2 group"
          >
            <div
              class="w-20 h-20 bg-black rounded-full border border-zinc-800 flex items-center justify-center mx-auto mb-6 text-4xl group-hover:border-secondary/50 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-300"
            >
              📅
            </div>
            <h3 class="text-xl font-bold mb-3 text-white">
              {{ t().easyBooking }}
            </h3>
            <p class="text-gray-400 leading-relaxed">
              {{ t().easyBookingDesc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Branch Spotlight -->
    <section class="py-24 bg-zinc-950 relative border-t border-white/5">
      <div class="container mx-auto px-4">
        <!-- Header Alignment Fix: items-start for mobile, items-end for desktop -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 class="text-4xl font-bold mb-2 text-white font-serif">
              {{ t().popularBranches }}
            </h2>
            <p class="text-gray-400 text-lg">{{ t().findLocation }}</p>
          </div>
          <a
            routerLink="/branches"
            class="text-secondary font-medium hover:text-white transition-colors flex items-center gap-2 group"
            >{{ t().viewAll }}
            <span class="group-hover:translate-x-1 transition-transform">-></span></a
          >
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          @if (isLoading()) { @for (item of [1, 2, 3]; track item) {
          <div
            class="h-96 rounded-3xl overflow-hidden shadow-2xl bg-zinc-900 border border-white/5"
          >
            <app-ui-skeleton height="100%" width="100%" className="bg-zinc-800"></app-ui-skeleton>
          </div>
          } } @else { @for (branch of popularBranches(); track branch.id) {
          <div
            [routerLink]="['/branches', branch.id]"
            class="group relative h-96 rounded-3xl overflow-hidden shadow-2xl cursor-pointer transform transition-all duration-500 hover:-translate-y-3"
          >
            <!-- Background Image -->
            <img
              [src]="branch.image || defaultImage"
              loading="lazy"
              [alt]="branch.name"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
            />

            <!-- Gradient Overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
            ></div>

            <!-- Top Badges -->
            <div class="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
              <!-- Rating Badge -->
              @if (branch.rating) {
              <div
                class="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10"
              >
                <span class="text-secondary text-sm">★</span>
                <span class="text-white text-sm font-bold">{{ branch.rating || 'New' }}</span>
                <span class="text-white/60 text-xs">({{ branch.reviewCount || 0 }})</span>
              </div>
              }

              <!-- Status Badge REMOVED -->
            </div>

            <!-- Bottom Content -->
            <div class="absolute bottom-0 left-0 right-0 p-8 z-10">
              <h3
                class="text-3xl font-bold text-white mb-3 leading-tight font-serif group-hover:text-secondary transition-colors"
              >
                {{ branch.name }}
              </h3>

              <div
                class="flex items-center gap-2 text-gray-300 mb-6 text-sm border-b border-white/10 pb-4"
              >
                <span class="text-secondary">📍</span>
                <span class="truncate">{{ branch.location }}</span>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex flex-col">
                  <span class="text-xs text-gray-400 uppercase tracking-wider mb-1">Hours</span>
                  <span class="text-sm text-white font-medium">{{
                    branch.hours || '10:00 AM - 2:00 AM'
                  }}</span>
                </div>

                <span
                  class="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-black transform group-hover:rotate-45 transition-transform duration-300"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div class="col-span-3 text-center py-20 text-gray-500">
            No branches available at the moment.
          </div>
          } }
        </div>
      </div>
    </section>

    <!-- Scroll to Top Button Removed (Shared in Laytout) -->
  `,
})
export class LandingPageComponent implements OnInit {
  private languageService = inject(LanguageService);
  private branchService = inject(BranchService);

  t = this.languageService.t; // Restoring translation signal
  popularBranches = signal<BranchExtended[]>([]);
  isLoading = signal(true);
  defaultImage =
    'https://png.pngtree.com/background/20250116/original/pngtree-modern-barbershop-interior-with-empty-black-chairs-wooden-walls-and-mirrors-picture-image_16212968.jpg';

  ngOnInit() {
    this.branchService.getAllBranches().subscribe({
      next: (branches) => {
        // Take first 3 branches as popular ones
        this.popularBranches.set(branches.slice(0, 3) as BranchExtended[]);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching branches:', err);
        this.isLoading.set(false);
      },
    });
  }
}
