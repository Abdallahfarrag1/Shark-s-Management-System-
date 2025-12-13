
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Hero Section -->
    <div class="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
      <div 
        class="absolute inset-0 bg-cover bg-center bg-fixed"
        style="background-image: url('EastNileBranch.jpg');"
      ></div>
      <div class="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      <div class="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
        <h1 class="text-5xl md:text-6xl font-bold mb-4 text-center tracking-tight  text-white">{{ t().contactUs }}</h1>
        <p class="text-xl md:text-2xl font-light text-gray-200 text-center max-w-2xl">{{ t().contactSubtitle }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="min-h-[60vh] bg-gray-50 flex items-center justify-center py-12 px-4">
      <div class="w-full max-w-lg space-y-8 text-center">
        
        <!-- Phone Numbers -->
        <div class="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
           <div class="space-y-6">
            <div class="flex items-center justify-center gap-3 group">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="text-green-500 w-8 h-8 flex-shrink-0 transition-transform group-hover:scale-110">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487 2.155.931 2.594.746 3.535.7.94-.046 2.083-.852 2.38-1.674.297-.822.297-1.524.208-1.674-.089-.148-.323-.237-.669-.385zM12 2C6.48 2 2 6.48 2 12c0 1.83.504 3.633 1.474 5.225l-1.564 5.613 5.867-1.503C9.37 22.42 10.686 23 12 23c5.52 23 10-4.48 10-10S17.52 2 12 2zm0 19.1c-1.516 0-2.997-.42-4.291-1.22l-.307-.191-3.192.818.868-3.053-.207-.341C3.805 15.655 3.3 13.88 3.3 12c0-4.8 3.9-8.7 8.7-8.7 4.8 0 8.7 3.9 8.7 8.7 0 4.8-3.9 8.7-8.7 8.7z"/>
              </svg>
              <a 
                href="https://wa.me/201113222370" 
                target="_blank" 
                class="text-2xl md:text-3xl font-bold text-gray-900 tracking-wide hover:text-green-600 transition-colors select-text"
                title="Chat on WhatsApp"
              >
                01113222370
              </a>
            </div>

            <div class="h-px bg-gray-100 w-1/2 mx-auto"></div>

            <div class="flex items-center justify-center gap-3 group">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="text-green-500 w-8 h-8 flex-shrink-0 transition-transform group-hover:scale-110">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487 2.155.931 2.594.746 3.535.7.94-.046 2.083-.852 2.38-1.674.297-.822.297-1.524.208-1.674-.089-.148-.323-.237-.669-.385zM12 2C6.48 2 2 6.48 2 12c0 1.83.504 3.633 1.474 5.225l-1.564 5.613 5.867-1.503C9.37 22.42 10.686 23 12 23c5.52 23 10-4.48 10-10S17.52 2 12 2zm0 19.1c-1.516 0-2.997-.42-4.291-1.22l-.307-.191-3.192.818.868-3.053-.207-.341C3.805 15.655 3.3 13.88 3.3 12c0-4.8 3.9-8.7 8.7-8.7 4.8 0 8.7 3.9 8.7 8.7 0 4.8-3.9 8.7-8.7 8.7z"/>
              </svg>
              <a 
                href="https://wa.me/201002313537" 
                target="_blank" 
                class="text-2xl md:text-3xl font-bold text-gray-900 tracking-wide hover:text-green-600 transition-colors select-text"
                title="Chat on WhatsApp"
              >
                01002313537
              </a>
            </div>
          </div>
        </div>

        <!-- Facebook Button -->
        <div>
           <a
             href="https://www.facebook.com/profile.php?id=61551409970406"
             target="_blank"
             class="inline-flex items-center gap-3 bg-[#1877F2] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#166fe5] transition-all hover:scale-105 shadow-lg w-full justify-center sm:w-auto hover:shadow-xl"
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
               <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
             </svg>
             {{ t().facebookPage }}
           </a>
        </div>
        
      </div>
    </div>
  `,
})
export class ContactComponent {
  langService = inject(LanguageService);
  t = this.langService.t;
}
