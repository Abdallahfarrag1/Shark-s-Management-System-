import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../components/store/product-card/product-card.component';
import { LanguageService } from '../../core/services/language.service';
import { ProductService } from '../../core/services/product.service';
import { UiSkeletonComponent } from '../../components/shared/ui-skeleton.component';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, UiSkeletonComponent],
  template: `
    <div class="min-h-screen bg-white pt-24 pb-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-12 text-center sm:text-left border-b border-gray-100 pb-8">
          <h1 class="text-4xl sm:text-5xl font-bold text-black font-serif tracking-tight mb-3">
            <span class="text-secondary">Sharks</span> {{ t().store }}
          </h1>
          <p class="text-lg text-gray-500 max-w-2xl font-light">
            {{ t().products }}
          </p>
        </div>

        <!-- Loading State -->
        @if (isLoading()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          @for (item of [1, 2, 3, 4, 5, 6, 7, 8]; track item) {
          <div
            class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-[400px]"
          >
            <app-ui-skeleton height="250px" width="100%"></app-ui-skeleton>
            <div class="p-4 space-y-3">
              <app-ui-skeleton height="24px" width="80%"></app-ui-skeleton>
              <app-ui-skeleton height="20px" width="60%"></app-ui-skeleton>
              <div class="flex justify-between items-center pt-2">
                <app-ui-skeleton height="24px" width="30%"></app-ui-skeleton>
                <app-ui-skeleton
                  height="36px"
                  width="40%"
                  className="rounded-full"
                ></app-ui-skeleton>
              </div>
            </div>
          </div>
          }
        </div>
        }

        <!-- Product Grid -->
        @if (!isLoading() && products().length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          @for (product of products(); track product.id) {
          <app-product-card [product]="product"></app-product-card>
          }
        </div>
        }

        <!-- Empty State -->
        @if (!isLoading() && products().length === 0) {
        <div class="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <p class="text-gray-400 text-lg">No products available at the moment</p>
        </div>
        }
      </div>
    </div>
  `,
})
export class StoreComponent implements OnInit {
  private languageService = inject(LanguageService);
  private productService = inject(ProductService);
  t = this.languageService.t;

  products = signal<Product[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading.set(false);
      },
    });
  }
}
