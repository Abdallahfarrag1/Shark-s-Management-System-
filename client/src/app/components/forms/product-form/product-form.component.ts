import { Component, Input, Output, EventEmitter, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../../core/services/product.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Modal Backdrop -->
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      (click)="onClose.emit()"
    >
      <!-- Modal Content -->
      <div
        class="rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        [style.background-color]="'var(--surface)'"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between p-6 border-b"
          [style.border-color]="'var(--border-light)'"
        >
          <h2 class="text-xl font-bold" [style.color]="'var(--text-primary)'">
            {{ isEditMode ? langService.t().editProduct : langService.t().addProduct }}
          </h2>
          <button
            (click)="onClose.emit()"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form (ngSubmit)="handleSubmit()" class="p-6 space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium mb-2" [style.color]="'var(--text-primary)'">
              {{ langService.t().productName }} *
            </label>
            <input
              type="text"
              [(ngModel)]="formData.name"
              name="name"
              required
              class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              [style.background-color]="'var(--bg-secondary)'"
              [style.border-color]="'var(--border-light)'"
              [style.color]="'var(--text-primary)'"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium mb-2" [style.color]="'var(--text-primary)'">
              {{ langService.t().description }}
            </label>
            <textarea
              [(ngModel)]="formData.description"
              name="description"
              rows="3"
              class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              [style.background-color]="'var(--bg-secondary)'"
              [style.border-color]="'var(--border-light)'"
              [style.color]="'var(--text-primary)'"
            ></textarea>
          </div>

          <!-- Price -->
          <div>
            <label class="block text-sm font-medium mb-2" [style.color]="'var(--text-primary)'">
              {{ langService.t().price }} *
            </label>
            <input
              type="number"
              [(ngModel)]="formData.price"
              name="price"
              required
              min="0"
              step="0.01"
              class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              [style.background-color]="'var(--bg-secondary)'"
              [style.border-color]="'var(--border-light)'"
              [style.color]="'var(--text-primary)'"
            />
          </div>

          <!-- Stock -->
          <div>
            <label class="block text-sm font-medium mb-2" [style.color]="'var(--text-primary)'">
              {{ langService.t().stock }}
            </label>
            <input
              type="number"
              [(ngModel)]="formData.stock"
              name="stock"
              min="0"
              class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              [style.background-color]="'var(--bg-secondary)'"
              [style.border-color]="'var(--border-light)'"
              [style.color]="'var(--text-primary)'"
            />
          </div>

          <!-- Image Upload -->
          <div>
            <label class="block text-sm font-medium mb-2" [style.color]="'var(--text-primary)'">
              {{ langService.t().image }}
            </label>
            <input
              type="file"
              (change)="onFileSelected($event)"
              accept="image/*"
              class="w-full px-4 py-2 rounded-lg border"
              [style.background-color]="'var(--bg-secondary)'"
              [style.border-color]="'var(--border-light)'"
              [style.color]="'var(--text-primary)'"
            />
            @if (imagePreview()) {
            <div class="mt-2">
              <img
                [src]="imagePreview()!"
                loading="lazy"
                [alt]="'Preview'"
                class="w-32 h-32 object-cover rounded"
              />
            </div>
            }
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              (click)="onClose.emit()"
              class="px-4 py-2 rounded-lg border font-medium transition-colors"
              [style.border-color]="'var(--border-light)'"
              [style.color]="'var(--text-secondary)'"
            >
              {{ langService.t().cancel }}
            </button>
            <button
              type="submit"
              [disabled]="isSaving()"
              class="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              style="background: var(--color-primary-500); color: white;"
            >
              {{ isSaving() ? 'Saving...' : langService.t().save }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ProductFormComponent implements OnInit {
  @Input() product: Product | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<void>();

  private productService = inject(ProductService);
  langService = inject(LanguageService);

  formData: Partial<Product> = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
  };

  isEditMode = false;
  isSaving = signal(false);
  imagePreview = signal<string | null>(null);
  selectedFile: File | null = null;

  ngOnInit() {
    if (this.product) {
      this.isEditMode = true;
      this.formData = { ...this.product };
      this.imagePreview.set(this.product.image || null);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async handleSubmit() {
    if (!this.formData.name || !this.formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    this.isSaving.set(true);

    try {
      // Create FormData for the API
      const formData = new FormData();
      formData.append('Name', this.formData.name!);
      formData.append('Description', this.formData.description || '');
      formData.append('Price', this.formData.price!.toString());
      formData.append('Stock', (this.formData.stock || 0).toString());

      // Add the image file if selected
      if (this.selectedFile) {
        formData.append('Image', this.selectedFile);
      }

      // Save product
      if (this.isEditMode && this.product?.id) {
        await this.productService.updateProduct(this.product.id, formData).toPromise();
      } else {
        await this.productService.createProduct(formData).toPromise();
      }

      this.onSave.emit();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    } finally {
      this.isSaving.set(false);
    }
  }
}
