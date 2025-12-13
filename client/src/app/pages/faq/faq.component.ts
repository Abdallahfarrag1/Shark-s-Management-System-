import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Top Hero Section with Parallax Effect -->
    <div class="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
      <div
        class="absolute inset-0 bg-cover bg-center"
        style="background-image: url('InsideBranch.jpg');"
      ></div>
      <div class="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      <div class="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
        <h1 class="text-5xl md:text-6xl font-bold mb-4 text-center tracking-tight text-white">
          {{ t().faqTitle }}
        </h1>
        <p class="text-xl md:text-2xl font-light text-primary-100 text-center max-w-2xl">
          {{ t().faqSubtitle }}
        </p>
      </div>
    </div>

    <div
      class="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 rounded-t-3xl border-t border-white/20"
    >
      <div class="max-w-4xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- FAQ List -->
          <div class="lg:col-span-2 space-y-4">
            <!-- FAQ Item 1 -->
            <div
              class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md group"
            >
              <button
                (click)="toggle(1)"
                class="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                [class.bg-primary-50]="openId === 1"
              >
                <div class="flex items-center gap-4">
                  <span
                    class="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm"
                    >01</span
                  >
                  <span
                    class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors"
                    >{{ t().q1 }}</span
                  >
                </div>
                <span class="ml-6 flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-gray-400 transform transition-transform duration-500 ease-out"
                    [class.rotate-180]="openId === 1"
                    [class.text-primary-500]="openId === 1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>
              <div
                class="grid transition-[grid-template-rows] duration-500 ease-out"
                [class.grid-rows-[1fr]]="openId === 1"
                [class.grid-rows-[0fr]]="openId !== 1"
              >
                <div class="overflow-hidden">
                  <div
                    class="px-6 pb-6 pt-2 text-gray-600 leading-relaxed border-t border-gray-100/50"
                  >
                    <div class="pl-12">
                      {{ t().a1 }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- FAQ Item 2 -->
            <div
              class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md group"
            >
              <button
                (click)="toggle(2)"
                class="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                [class.bg-primary-50]="openId === 2"
              >
                <div class="flex items-center gap-4">
                  <span
                    class="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm"
                    >02</span
                  >
                  <span
                    class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors"
                    >{{ t().q2 }}</span
                  >
                </div>
                <span class="ml-6 flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-gray-400 transform transition-transform duration-500 ease-out"
                    [class.rotate-180]="openId === 2"
                    [class.text-primary-500]="openId === 2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>
              <div
                class="grid transition-[grid-template-rows] duration-500 ease-out"
                [class.grid-rows-[1fr]]="openId === 2"
                [class.grid-rows-[0fr]]="openId !== 2"
              >
                <div class="overflow-hidden">
                  <div
                    class="px-6 pb-6 pt-2 text-gray-600 leading-relaxed border-t border-gray-100/50"
                  >
                    <div class="pl-12">
                      {{ t().a2 }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- FAQ Item 3 -->
            <div
              class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md group"
            >
              <button
                (click)="toggle(3)"
                class="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                [class.bg-primary-50]="openId === 3"
              >
                <div class="flex items-center gap-4">
                  <span
                    class="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm"
                    >03</span
                  >
                  <span
                    class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors"
                    >{{ t().q3 }}</span
                  >
                </div>
                <span class="ml-6 flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-gray-400 transform transition-transform duration-500 ease-out"
                    [class.rotate-180]="openId === 3"
                    [class.text-primary-500]="openId === 3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>
              <div
                class="grid transition-[grid-template-rows] duration-500 ease-out"
                [class.grid-rows-[1fr]]="openId === 3"
                [class.grid-rows-[0fr]]="openId !== 3"
              >
                <div class="overflow-hidden">
                  <div
                    class="px-6 pb-6 pt-2 text-gray-600 leading-relaxed border-t border-gray-100/50"
                  >
                    <div class="pl-12">
                      {{ t().a3 }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- FAQ Item 4 (Services) -->
            <div
              class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md group"
            >
              <button
                (click)="toggle(4)"
                class="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                [class.bg-primary-50]="openId === 4"
              >
                <div class="flex items-center gap-4">
                  <span
                    class="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm"
                    >04</span
                  >
                  <span
                    class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors"
                    >{{ t().q4 }}</span
                  >
                </div>
                <span class="ml-6 flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-gray-400 transform transition-transform duration-500 ease-out"
                    [class.rotate-180]="openId === 4"
                    [class.text-primary-500]="openId === 4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>
              <div
                class="grid transition-[grid-template-rows] duration-500 ease-out"
                [class.grid-rows-[1fr]]="openId === 4"
                [class.grid-rows-[0fr]]="openId !== 4"
              >
                <div class="overflow-hidden">
                  <div
                    class="px-6 pb-6 pt-2 text-gray-600 leading-relaxed border-t border-gray-100/50"
                  >
                    <div class="pl-12 flex flex-col md:flex-row gap-6">
                      <div class="flex-1">
                        {{ t().a4 }}
                      </div>
                      <!-- Visual Aid for Services -->
                      <div
                        class="w-full md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 shadow-sm"
                      >
                        <img
                          src="MaskService.jpg"
                          alt="Barber Services"
                          class="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- FAQ Item 5 -->
            <div
              class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md group"
            >
              <button
                (click)="toggle(5)"
                class="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                [class.bg-primary-50]="openId === 5"
              >
                <div class="flex items-center gap-4">
                  <span
                    class="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm"
                    >05</span
                  >
                  <span
                    class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors"
                    >{{ t().q5 }}</span
                  >
                </div>
                <span class="ml-6 flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-gray-400 transform transition-transform duration-500 ease-out"
                    [class.rotate-180]="openId === 5"
                    [class.text-primary-500]="openId === 5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>
              <div
                class="grid transition-[grid-template-rows] duration-500 ease-out"
                [class.grid-rows-[1fr]]="openId === 5"
                [class.grid-rows-[0fr]]="openId !== 5"
              >
                <div class="overflow-hidden">
                  <div
                    class="px-6 pb-6 pt-2 text-gray-600 leading-relaxed border-t border-gray-100/50"
                  >
                    <div class="pl-12">
                      {{ t().a5 }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Contact Box -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24 border border-gray-100">
              <div class="text-center mb-6">
                <div
                  class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600 shadow-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-8 h-8"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">{{ t().contactSubtitle }}</h3>
                <p class="text-sm text-gray-500 mb-6">{{ t().slogan }}</p>

                <a
                  routerLink="/contact"
                  class="group relative inline-flex items-center justify-center w-full overflow-hidden rounded-xl bg-black px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:bg-gray-900 hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  <span class="relative flex items-center gap-2">
                    {{ t().contactUs }}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FaqComponent {
  langService = inject(LanguageService);
  t = this.langService.t;
  openId: number | null = null;

  toggle(id: number) {
    this.openId = this.openId === id ? null : id;
  }
}
