import { Component, signal, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { LightXService } from '../../core/services/lightx.service';
import { AuthService } from '../../core/services/auth.service';

interface HairTypeOption {
  id: number;
  label: string;
  arabicLabel: string; // Added for UI localization
  prompt: string;
  description: string;
  recommendation: string;
  arabicRecommendation: string;
}

@Component({
  selector: 'app-hairstyle-recommender',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hairstyle-recommender.component.html',
})
export class HairstyleRecommenderComponent {
  private lightXService = inject(LightXService);
  public langService = inject(LanguageService);
  public authService = inject(AuthService);
  t = this.langService.t;

  // Signals
  generatedImageUrl = signal<string | null>(null);
  previewUrl = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  selectedHairType = signal<number>(1);

  // State variables
  isDragging = false;
  selectedFile: File | null = null;

  // Base prompt instructions to ensure realism across all styles
  // This instructs the AI to behave like a camera and a barber, preserving the face ID.
  // private readonly baseRealismPrompt = 'Hyper-realistic 8k portrait, professional barbershop photography, sharp focus, natural skin texture, preserve facial features and identity, seamless blending of hair and scalp, cinematic lighting.';

  hairTypes: HairTypeOption[] = [
    {
      id: 1,
      label: 'Egyptian Classic Taper Fade',
      arabicLabel: 'تحديد مصري فايد',
      prompt:
        'Egyptian classic taper fade haircut, short length, keep original hair color, no new hair, realistic barber style',
      description: "Clean Egyptian taper fade using only the user's real hair.",
      recommendation: 'Best for round and oval faces.',
      arabicRecommendation: 'مثالي للوجه الدائري والبيضاوي.',
    },
    {
      id: 2,
      label: 'Egyptian Textured Crop',
      arabicLabel: 'كروب مصري',
      prompt:
        'Egyptian textured crop, short hair, keep original hair color, clean fade, realistic look',
      description: 'Short textured crop common in Egypt.',
      recommendation: 'Enhances front hair naturally.',
      arabicRecommendation: 'يقوي شكل مقدمة الشعر بشكل طبيعي.',
    },
    {
      id: 3,
      label: 'Egyptian Caesar Cut',
      arabicLabel: 'سيزر مصري',
      prompt:
        'Egyptian Caesar cut, short length, keep original hair color, sharp hairline, realistic barber style',
      description: 'Short Egyptian Caesar.',
      recommendation: 'Good for uneven hairlines.',
      arabicRecommendation: 'ممتاز لتسوية مقدمة الشعر.',
    },
    {
      id: 4,
      label: 'Egyptian Low Fade + Short Top',
      arabicLabel: 'لو فايد مصري مع توب قصير',
      prompt:
        'Egyptian low fade with short top, keep original hair color, clean cut, realistic barber style',
      description: 'Low fade with short natural top.',
      recommendation: 'Perfect for thick hair.',
      arabicRecommendation: 'ممتاز للشعر الكثيف.',
    },
    {
      id: 5,
      label: 'Egyptian Ultra Short Buzz',
      arabicLabel: 'زيرو مصري خفيف',
      prompt:
        'Egyptian ultra short buzz cut, very short length, keep original hair color, clean fade',
      description: 'Ultra short buzzcut.',
      recommendation: 'Very easy to maintain.',
      arabicRecommendation: 'سهل جداً في العناية.',
    },
    {
      id: 6,
      label: 'Egyptian Short Spiky',
      arabicLabel: 'سبايكي مصري قصير',
      prompt:
        'Egyptian short spiky hair, keep original hair color, textured look, realistic barber style',
      description: 'Short natural spike style.',
      recommendation: 'Adds style without fake volume.',
      arabicRecommendation: 'شكل شبابي بدون تغيير الشعر.',
    },
    {
      id: 7,
      label: 'Egyptian Medium Fade',
      arabicLabel: 'ميد فايد مصري',
      prompt:
        'Egyptian medium fade, short hair, keep original hair color, clean blending, realistic barber style',
      description: 'Medium Egyptian fade.',
      recommendation: 'Good all-around haircut.',
      arabicRecommendation: 'قَصة مناسبة لكل الأوجه.',
    },
    {
      id: 8,
      label: 'Egyptian High Fade',
      arabicLabel: 'هاي فايد مصري',
      prompt:
        'Egyptian high fade, short hair, keep original hair color, sharp look, realistic barber style',
      description: 'High and sharp fade.',
      recommendation: 'For bold sharp looks.',
      arabicRecommendation: 'لشكل جريء وحدّ.',
    },
    {
      id: 9,
      label: 'Egyptian Short Blowout',
      arabicLabel: 'بلو اوت مصري قصير',
      prompt:
        'Egyptian short blowout, keep original hair color, textured volume, realistic barber style',
      description: 'Short blowout using real hair only.',
      recommendation: 'Good for thick textured hair.',
      arabicRecommendation: 'مناسب للشعر الكثيف.',
    },
    {
      id: 10,
      label: 'Egyptian Curly Short Fade',
      arabicLabel: 'فايد قصير للشعر الكيرلي',
      prompt:
        'Egyptian curly short fade, keep original hair color, define curls, realistic barber style',
      description: 'Short fade for curly hair.',
      recommendation: 'Maintains curl definition.',
      arabicRecommendation: 'يحافظ على شكل الكيرلي الطبيعي.',
    },
    {
      id: 11,
      label: 'Egyptian Short Military Cut',
      arabicLabel: 'جيش مصري قصير',
      prompt:
        'Egyptian short military cut, very short length, keep original hair color, uniform cut',
      description: 'Military-style short cut.',
      recommendation: 'Very clean and formal.',
      arabicRecommendation: 'شكل انضباطي نضيف جداً.',
    },
    {
      id: 12,
      label: 'Egyptian Short Side Part',
      arabicLabel: 'سايد بارت مصري قصير',
      prompt:
        'Egyptian short side part, keep original hair color, classic look, realistic barber style',
      description: 'Short natural side part.',
      recommendation: 'Adds elegance while staying natural.',
      arabicRecommendation: 'شكل راقي وطبيعي.',
    },
    {
      id: 13,
      label: 'Egyptian Short Quiff',
      arabicLabel: 'كويف مصري قصير',
      prompt:
        'Egyptian short quiff, keep original hair color, textured top, realistic barber style',
      description: 'Short subtle quiff.',
      recommendation: 'Adds slight height without fake volume.',
      arabicRecommendation: 'يرفع المقدمة بشكل طبيعي.',
    },
    {
      id: 14,
      label: 'Egyptian Crew Cut',
      arabicLabel: 'كرو كت مصري',
      prompt:
        'Egyptian crew cut, short length, keep original hair color, clean fade, realistic barber style',
      description: 'Clean Egyptian crew cut.',
      recommendation: 'Professional clean look.',
      arabicRecommendation: 'مظهر رسمي نضيف.',
    },
    {
      id: 15,
      label: 'Egyptian Very Short Textured Top',
      arabicLabel: 'توب تكستشر مصري قصير جداً',
      prompt:
        'Egyptian very short textured top, keep original hair color, low maintenance, realistic barber style',
      description: 'Very short textured top.',
      recommendation: 'Adds shape while staying ultra natural.',
      arabicRecommendation: 'شكل منسق وطبيعي جداً.',
    },
  ];

  get currentRecommendation(): string {
    const type = this.hairTypes.find((t) => t.id === this.selectedHairType());
    if (!type) return '';
    return this.langService.currentLang() === 'ar'
      ? type.arabicRecommendation
      : type.recommendation;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.processFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  private processFile(file: File) {
    if (!file.type.startsWith('image/')) {
      this.error.set(this.t().validImageError);
      return;
    }

    this.selectedFile = file;
    this.error.set(null);
    this.generatedImageUrl.set(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  selectHairType(id: number) {
    this.selectedHairType.set(id);
  }

  generateHairstyle() {
    if (!this.selectedFile) {
      this.error.set(this.t().uploadFirstError);
      return;
    }

    const selectedType = this.hairTypes.find((t) => t.id === this.selectedHairType());
    if (!selectedType) return;

    this.isLoading.set(true);
    this.error.set(null);

    // Call service
    this.lightXService.generateHairstyle(this.selectedFile, selectedType.prompt).subscribe({
      next: (imageUrl) => {
        this.generatedImageUrl.set(imageUrl);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set(this.t().failedToGenerate || 'Failed to generate hairstyle');
        this.isLoading.set(false);
      },
    });
  }
}
