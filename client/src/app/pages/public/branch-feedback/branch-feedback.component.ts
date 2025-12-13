import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BranchService, Branch } from '../../../core/services/branch.service';
import { FeedbackService } from '../../../core/services/feedback.service';
import { UiSkeletonComponent } from '../../../components/shared/ui-skeleton.component';

@Component({
  selector: 'app-branch-feedback',
  standalone: true,
  imports: [CommonModule, UiSkeletonComponent],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4"
    >
      <div class="max-w-md w-full">
        <div class="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          @if (isLoading()) {
          <div class="text-center py-8">
            <div class="mx-auto mb-4 flex justify-center">
              <app-ui-skeleton
                width="64px"
                height="64px"
                className="rounded-full"
              ></app-ui-skeleton>
            </div>
            <div class="space-y-2 flex flex-col items-center">
              <app-ui-skeleton width="200px" height="32px"></app-ui-skeleton>
              <app-ui-skeleton width="150px" height="24px"></app-ui-skeleton>
            </div>
          </div>
          } @else if (branch()) {
          <div class="text-center">
            <div
              class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-8 h-8 text-primary-600"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                />
              </svg>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ branch()!.name }}</h1>
            <p class="text-gray-600">How was your experience?</p>
          </div>

          @if (!submitted()) {
          <div class="py-6">
            <div class="flex justify-center gap-2">
              @for (star of [1, 2, 3, 4, 5]; track star) {
              <button
                (click)="selectRating(star)"
                (mouseenter)="hoverRating.set(star)"
                (mouseleave)="hoverRating.set(0)"
                class="transition-all duration-200 transform hover:scale-110 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  [attr.fill]="
                    hoverRating() >= star || selectedRating() >= star ? 'currentColor' : 'none'
                  "
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  [class]="
                    hoverRating() >= star || selectedRating() >= star
                      ? 'w-12 h-12 text-yellow-400'
                      : 'w-12 h-12 text-gray-300'
                  "
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              </button>
              }
            </div>
            @if (selectedRating() > 0) {
            <p class="text-center mt-4 text-lg font-medium text-gray-700">
              {{ getRatingText() }}
            </p>
            }
          </div>

          <button
            (click)="submitFeedback()"
            [disabled]="selectedRating() === 0 || isSubmitting()"
            class="w-full bg-green-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            @if (isSubmitting()) {
            <span class="flex items-center justify-center gap-2">
              <div
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              Submitting...
            </span>
            } @else { Submit Feedback }
          </button>
          } @else {
          <div class="text-center py-8">
            <div
              class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-8 h-8 text-green-600"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p class="text-gray-600">Your feedback has been submitted successfully.</p>
          </div>
          } } @else {
          <div class="text-center py-8">
            <div
              class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-8 h-8 text-red-600"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Branch Not Found</h2>
            <p class="text-gray-600">Unable to load branch information.</p>
          </div>
          }
        </div>

        @if (showToast()) {
        <div
          class="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg animate-slide-up"
        >
          <div class="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <p class="font-medium">You already submitted your feedback today. Thank you!</p>
          </div>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes slide-up {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      .animate-slide-up {
        animation: slide-up 0.3s ease-out;
      }
    `,
  ],
})
export class BranchFeedbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private branchService = inject(BranchService);
  private feedbackService = inject(FeedbackService);

  branch = signal<Branch | null>(null);
  isLoading = signal(true);
  selectedRating = signal(0);
  hoverRating = signal(0);
  isSubmitting = signal(false);
  submitted = signal(false);
  showToast = signal(false);

  ngOnInit() {
    const branchId = this.route.snapshot.paramMap.get('branchId');
    if (branchId) {
      this.loadBranch(parseInt(branchId));
    } else {
      this.isLoading.set(false);
    }
  }

  loadBranch(id: number) {
    // Use getAllBranches (public) instead of getBranch (protected) to allow guest access
    this.branchService.getAllBranches().subscribe({
      next: (branches) => {
        const foundBranch = branches.find((b) => b.id === id);
        if (foundBranch) {
          this.branch.set(foundBranch);
        } else {
          console.error('Branch not found in public list');
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading branches:', error);
        this.isLoading.set(false);
      },
    });
  }

  selectRating(rating: number) {
    this.selectedRating.set(rating);
  }

  getRatingText(): string {
    const rating = this.selectedRating();
    const texts = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    return texts[rating] || '';
  }

  submitFeedback() {
    if (this.selectedRating() === 0 || !this.branch()) return;

    this.isSubmitting.set(true);
    const branchId = this.branch()!.id;
    const rating = this.selectedRating();

    this.feedbackService.submitFeedback(branchId, rating).subscribe({
      next: (success) => {
        this.isSubmitting.set(false);
        if (success) {
          this.submitted.set(true);
        } else {
          this.showToast.set(true);
          setTimeout(() => this.showToast.set(false), 5000);
        }
      },
      error: (error) => {
        console.error('Error submitting feedback:', error);
        this.isSubmitting.set(false);
        this.showToast.set(true);
        setTimeout(() => this.showToast.set(false), 5000);
      },
    });
  }
}
