import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-surveys',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold" [style.color]="'var(--text-primary)'">
          {{ langService.t().surveysFeedback }}
        </h2>
      </div>

      <!-- Feedback Link Card -->
      <div
        class="bg-white rounded-lg shadow p-6"
        [style.background-color]="'var(--surface)'"
        [style.border]="'1px solid var(--border-light)'"
      >
        <div class="flex items-start gap-4">
          <div
            class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 text-primary-600"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold mb-2" [style.color]="'var(--text-primary)'">
              {{ langService.t().customerFeedbackLink }}
            </h3>
            <p class="text-sm mb-4" [style.color]="'var(--text-secondary)'">
              {{ langService.t().shareLinkDesc }}
            </p>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Link Section -->
              <div class="space-y-3">
                <label class="text-sm font-medium" [style.color]="'var(--text-primary)'">{{
                  langService.t().feedbackLink
                }}</label>
                <div class="flex gap-2">
                  <a
                    [href]="feedbackUrl"
                    target="_blank"
                    class="flex-1 bg-gray-50 rounded-lg px-4 py-3 text-sm break-all border hover:bg-gray-100 transition-colors text-primary-600 hover:text-primary-700 font-medium underline"
                    [style.border-color]="'var(--border-light)'"
                  >
                    {{ feedbackUrl }}
                  </a>
                  <button
                    (click)="copyToClipboard()"
                    class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    @if (copied()) {
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      class="w-5 h-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {{ langService.t().copied }} } @else {
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-5 h-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                      />
                    </svg>
                    {{ langService.t().copy }} }
                  </button>
                </div>
              </div>

              <!-- QR Code Section -->
              <div class="space-y-3">
                <label class="text-sm font-medium" [style.color]="'var(--text-primary)'">{{
                  langService.t().qrCode
                }}</label>
                <div
                  class="flex flex-col items-center gap-3 bg-gray-50 rounded-lg p-4 border"
                  [style.border-color]="'var(--border-light)'"
                >
                  <img
                    [src]="qrCodeUrl"
                    alt="Feedback QR Code"
                    class="w-48 h-48 rounded-lg shadow-sm"
                  />
                  <a
                    [href]="qrCodeUrl"
                    [download]="
                      'feedback-qr-branch-' + (authService.managedBranchId || 'code') + '.png'
                    "
                    class="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-5 h-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    {{ langService.t().downloadQrCode }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SurveysComponent {
  langService = inject(LanguageService);
  authService = inject(AuthService);

  copied = signal(false);

  get feedbackUrl(): string {
    const branchId = this.authService.managedBranchId || 'YOUR_BRANCH_ID';
    return `${window.location.origin}/public/feedback/${branchId}`;
  }

  get qrCodeUrl(): string {
    return this.generateQr(this.feedbackUrl);
  }

  generateQr(text: string): string {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      text
    )}`;
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.feedbackUrl).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
