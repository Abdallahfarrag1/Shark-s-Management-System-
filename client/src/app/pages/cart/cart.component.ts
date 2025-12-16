import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8 min-h-screen">
      <h1 class="text-3xl font-bold mb-8">{{ t().shoppingCart }}</h1>

      @if (cartService.items().length === 0) {
      <!-- Empty Cart -->
      <div class="text-center py-16">
        <svg
          class="w-24 h-24 mx-auto text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h2 class="text-2xl font-semibold text-gray-600 mb-4">{{ t().cartEmpty }}</h2>
        <p class="text-gray-500 mb-8">{{ t().addProductsMsg }}</p>
        <a
          routerLink="/store"
          class="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
        >
          {{ t().continueShopping }}
        </a>
      </div>
      } @else {
      <!-- Cart Items -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Items List -->
        <div class="lg:col-span-2 space-y-4">
          <div class="flex justify-end mb-2">
            <button (click)="clearCart()" class="text-red-500 text-sm hover:underline">
              {{ t().clearCart }}
            </button>
          </div>

          @for (item of cartService.items(); track item.productId) {
          <div class="bg-white rounded-lg shadow-md p-4 flex gap-4">
            <!-- Product Image -->
            <img
              [src]="
                item.image ||
                'https://st4.depositphotos.com/16122460/21586/i/1600/depositphotos_215866804-stock-photo-flat-lay-composition-hair-salon.jpg'
              "
              loading="lazy"
              [alt]="item.productName"
              class="w-24 h-24 object-cover rounded"
            />

            <!-- Product Details -->
            <div class="flex-1">
              <h3 class="text-lg font-semibold">{{ item.productName }}</h3>
              <p class="text-gray-600">{{ item.price }} {{ t().currency }}</p>

              <!-- Quantity Controls -->
              <div class="flex items-center gap-3 mt-2">
                <button
                  (click)="updateQuantity(item.productId, item.quantity - 1)"
                  class="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                  [disabled]="item.quantity <= 1"
                >
                  −
                </button>
                <span class="font-medium">{{ item.quantity }}</span>
                <button
                  (click)="updateQuantity(item.productId, item.quantity + 1)"
                  class="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
                  [disabled]="item.quantity >= (item.stock || 99)"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Subtotal and Remove -->
            <div class="text-right">
              <p class="text-lg font-bold">{{ item.price * item.quantity }} {{ t().currency }}</p>
              <button
                (click)="removeItem(item.productId)"
                class="mt-2 text-red-600 hover:text-red-800 text-sm"
              >
                {{ t().remove }}
              </button>
            </div>
          </div>
          }
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 class="text-xl font-bold mb-4">{{ t().orderSummary }}</h2>

            <div class="space-y-4 mb-4">
              <!-- Contact Info Inputs -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{
                  t().phoneNumberLabel
                }}</label>
                <input
                  type="tel"
                  [(ngModel)]="phone"
                  (ngModelChange)="onInfoChange()"
                  placeholder="01xxxxxxxxx"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{
                  t().shippingAddress
                }}</label>
                <textarea
                  [(ngModel)]="address"
                  (ngModelChange)="onInfoChange()"
                  [placeholder]="t().scAddressPlaceholder"
                  rows="2"
                  class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>

              <div class="border-t pt-4">
                <div class="flex justify-between mb-2">
                  <span
                    >{{ t().subtotal }} ({{ cartService.totalItems() }} {{ t().itemsCount }})</span
                  >
                  <span>{{ cartService.totalPrice() }} {{ t().currency }}</span>
                </div>
                <div class="flex justify-between text-lg font-bold">
                  <span>{{ t().total }}</span>
                  <span>{{ cartService.totalPrice() }} {{ t().currency }}</span>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-3">
              <button
                (click)="proceedToCheckout()"
                [disabled]="!isValid()"
                [class.opacity-50]="!isValid()"
                [class.cursor-not-allowed]="!isValid()"
                class="block w-full bg-green-600 text-white text-center px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
              >
                {{ t().proceedToCheckout }}
              </button>

              <a
                routerLink="/store"
                class="block w-full border border-gray-300 text-center text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition"
              >
                {{ t().continueShopping }}
              </a>
            </div>
          </div>
        </div>
      </div>
      }
    </div>
  `,
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  langService = inject(LanguageService);
  private router = inject(Router);
  private authService = inject(AuthService);
  t = this.langService.t;

  phone = '';
  address = '';

  ngOnInit() {
    this.phone = this.cartService.checkoutPhone();
    this.address = this.cartService.checkoutAddress();
  }

  onInfoChange() {
    this.cartService.updateCheckoutInfo(this.phone, this.address);
  }

  isValid() {
    return this.phone.trim().length > 0 && this.address.trim().length > 0;
  }

  proceedToCheckout() {
    if (this.isValid()) {
      if (this.authService.isAuthenticated) {
        this.router.navigate(['/checkout']);
      } else {
        this.router.navigate(['/auth/login'], {
          queryParams: { returnUrl: '/checkout' },
        });
      }
    }
  }

  updateQuantity(productId: number, newQuantity: number) {
    this.cartService.updateQuantity(productId, newQuantity);
  }

  removeItem(productId: number) {
    if (confirm(this.t().confirmRemoveItem)) {
      this.cartService.removeFromCart(productId);
    }
  }

  clearCart() {
    if (confirm(this.t().confirmClearCart)) {
      this.cartService.clearCart();
    }
  }
}
