import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { LanguageService } from '../../../core/services/language.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="group bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100"
    >
      <!-- Product Image -->
      <div class="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <img
          [src]="product.image || defaultImage"
          loading="lazy"
          [alt]="product.name"
          class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />

        <!-- Stock Badge -->
        <div class="absolute top-4 left-4">
          <span
            class="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm backdrop-blur-md"
            [ngClass]="
              product.stock && product.stock > 0
                ? 'bg-white/90 text-green-700'
                : 'bg-red-500 text-white'
            "
          >
            {{ product.stock && product.stock > 0 ? t().inStock : t().outOfStock }}
          </span>
        </div>

        <!-- Add to Cart Overlay Button (Desktop) -->
        <div
          class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 pointer-events-none group-hover:pointer-events-auto"
        >
          <button
            (click)="addToCart()"
            [disabled]="!product.stock || product.stock === 0"
            class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-r from-secondary to-yellow-500 hover:from-yellow-500 hover:to-secondary text-black font-bold shadow-xl px-6 py-3 rounded-full flex items-center gap-2 border-none"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-5 flex-1 flex flex-col">
        <div class="flex-1">
          <div class="flex justify-between items-start gap-2 mb-2">
            <h3 class="text-lg font-bold text-black leading-tight font-serif">
              {{ product.name }}
            </h3>
            <span class="text-lg font-bold text-secondary whitespace-nowrap">
              EGP {{ product.price }}
            </span>
          </div>

          <p class="text-sm text-gray-500 line-clamp-2 mb-4">
            {{ product.description }}
          </p>
        </div>

        <!-- Mobile Action (Always visible on mobile) -->
        <div class="md:hidden mt-2">
          <button
            (click)="addToCart()"
            [disabled]="!product.stock || product.stock === 0"
            class="w-full bg-black text-white py-2 text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-secondary hover:text-black transition-colors duration-300 font-bold"
          >
            {{ t().addToCart }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  @Input() product!: Product;

  readonly defaultImage =
    'https://st4.depositphotos.com/16122460/21586/i/1600/depositphotos_215866804-stock-photo-flat-lay-composition-hair-salon.jpg';

  langService = inject(LanguageService);
  private cartService = inject(CartService);
  t = this.langService.t;

  addToCart() {
    if (this.product.stock && this.product.stock > 0) {
      this.cartService.addToCart(
        {
          productId: this.product.id!,
          productName: this.product.name,
          price: this.product.price,
          image: this.product.image,
          stock: this.product.stock,
        },
        1
      );
    }
  }
}
