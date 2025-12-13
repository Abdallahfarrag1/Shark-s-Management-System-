import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { LanguageService } from '../../core/services/language.service';
import { CreateOrderRequest, OrderItemDto } from '../../core/models/order.model';

declare var paypal: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-white py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold mb-8 text-black font-serif border-b border-gray-100 pb-4">
          {{ t().checkoutTitle }}
        </h1>

        @if (cartService.items().length === 0) {
        <div class="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <div class="text-6xl mb-4">🛒</div>
          <p class="text-gray-500 mb-6 text-lg">{{ t().cartEmpty }}</p>
          <a
            routerLink="/store"
            class="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-secondary hover:text-black transition-colors duration-300 shadow-lg"
          >
            {{ t().continueShopping }}
          </a>
        </div>
        } @else {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Order Summary -->
          <div class="lg:col-span-2">
            <h2 class="text-2xl font-bold mb-6 text-black flex items-center gap-2">
              <span class="text-secondary">01.</span> {{ t().orderSummary }}
            </h2>
            <div class="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm">
              <!-- Contact Info Preview -->
              <div class="mb-8 pb-8 border-b border-gray-200">
                <h3 class="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">
                  {{ t().shippingDetails }}
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-white p-4 rounded-xl border border-gray-100">
                    <span class="block text-xs text-gray-400 uppercase tracking-widest mb-1">{{
                      t().phoneNumberLabel
                    }}</span>
                    <span class="font-medium text-black">{{ cartService.checkoutPhone() }}</span>
                  </div>
                  <div class="bg-white p-4 rounded-xl border border-gray-100">
                    <span class="block text-xs text-gray-400 uppercase tracking-widest mb-1">{{
                      t().shippingAddress
                    }}</span>
                    <span class="font-medium text-black">{{ cartService.checkoutAddress() }}</span>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                @for (item of cartService.items(); track item.productId) {
                <div
                  class="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100"
                >
                  <div class="flex items-center gap-4">
                    <img
                      [src]="
                        item.image ||
                        'https://st4.depositphotos.com/16122460/21586/i/1600/depositphotos_215866804-stock-photo-flat-lay-composition-hair-salon.jpg'
                      "
                      loading="lazy"
                      [alt]="item.productName"
                      class="w-12 h-12 rounded-lg object-cover bg-gray-100"
                    />
                    <div>
                      <p class="font-bold text-black">{{ item.productName }}</p>
                      <p class="text-sm text-gray-500">
                        {{ t().qty }}: {{ item.quantity }} × {{ item.price }} {{ t().currency }}
                      </p>
                    </div>
                  </div>
                  <p class="font-bold text-lg text-black">
                    {{ item.price * item.quantity }}
                    <span class="text-sm text-gray-400">{{ t().currency }}</span>
                  </p>
                </div>
                }
              </div>

              <div class="mt-8 pt-6 border-t border-gray-200">
                <div class="flex justify-between items-end">
                  <span class="text-gray-500 font-medium">{{ t().totalAmount }}</span>
                  <span class="text-3xl font-bold text-black font-serif"
                    >{{ cartService.totalPrice() }}
                    <span class="text-secondary text-lg">{{ t().currency }}</span></span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Payment -->
          <div>
            <h2 class="text-2xl font-bold mb-6 text-black flex items-center gap-2">
              <span class="text-secondary">02.</span> {{ t().paymentTitle }}
            </h2>
            <div class="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-24">
              <!-- Payment Method Selection -->
              <div class="space-y-4 mb-8">
                <label
                  class="flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-300"
                  [class.border-secondary]="selectedPaymentMethod() === 'PayPal'"
                  [class.bg-white]="selectedPaymentMethod() === 'PayPal'"
                  [class.shadow-md]="selectedPaymentMethod() === 'PayPal'"
                  [class.border-gray-200]="selectedPaymentMethod() !== 'PayPal'"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="PayPal"
                    [ngModel]="selectedPaymentMethod()"
                    (ngModelChange)="selectedPaymentMethod.set($event)"
                    class="w-5 h-5 text-secondary focus:ring-secondary border-gray-300"
                  />
                  <div class="ml-3">
                    <span class="block font-bold text-black">{{ t().payPal }}</span>
                    <span class="block text-xs text-gray-500">{{ t().creditDebitCard }}</span>
                  </div>
                </label>

                <label
                  class="flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-300"
                  [class.border-secondary]="selectedPaymentMethod() === 'Cash'"
                  [class.bg-white]="selectedPaymentMethod() === 'Cash'"
                  [class.shadow-md]="selectedPaymentMethod() === 'Cash'"
                  [class.border-gray-200]="selectedPaymentMethod() !== 'Cash'"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash"
                    [ngModel]="selectedPaymentMethod()"
                    (ngModelChange)="selectedPaymentMethod.set($event)"
                    class="w-5 h-5 text-secondary focus:ring-secondary border-gray-300"
                  />
                  <div class="ml-3">
                    <span class="block font-bold text-black">{{ t().cashOnDelivery }}</span>
                    <span class="block text-xs text-gray-500">{{ t().payWhenReceived }}</span>
                  </div>
                </label>
              </div>

              @if (isProcessing()) {
              <div class="text-center py-8">
                <div
                  class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"
                ></div>
                <p class="mt-4 text-gray-600 font-medium">{{ t().processingPayment }}</p>
              </div>
              } @else {
              <!-- PayPal Container -->
              <div
                [hidden]="selectedPaymentMethod() !== 'PayPal'"
                id="paypal-button-container"
                class="mb-4"
              ></div>

              <!-- Cash Button -->
              @if (selectedPaymentMethod() === 'Cash') {
              <button
                (click)="placeCashOrder()"
                class="w-full bg-gradient-to-r from-secondary to-yellow-500 text-black font-bold py-4 px-6 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 shadow-md shadow-yellow-500/20"
              >
                {{ t().placeOrder }} ({{ cartService.totalPrice() }} {{ t().currency }})
              </button>
              } }
            </div>
          </div>
        </div>
        }
      </div>

      <!-- Confirmation Modal -->
      @if (showConfirmationModal()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        (click)="closeModal()"
      >
        <div
          class="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all scale-100"
          (click)="$event.stopPropagation()"
        >
          <div class="text-center">
            <div
              class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-6"
            >
              <span class="text-3xl">💵</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ t().confirmOrderTitle }}</h3>
            <p class="text-gray-500 mb-8">
              {{ t().confirmOrderMsg }}
            </p>

            <div class="flex flex-col gap-3">
              <button
                (click)="confirmCashOrder()"
                class="w-full bg-black text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors"
              >
                {{ t().confirmOrderBtn }}
              </button>
              <button
                (click)="closeModal()"
                class="w-full bg-white text-gray-700 font-bold py-3 px-6 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {{ t().cancel }}
              </button>
            </div>
          </div>
        </div>
      </div>
      }
    </div>
  `,
})
export class CheckoutComponent implements OnInit {
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  public languageService = inject(LanguageService);
  t = this.languageService.t;

  isProcessing = signal(false);
  selectedPaymentMethod = signal<'PayPal' | 'Cash'>('PayPal');
  showConfirmationModal = signal(false);

  ngOnInit() {
    if (this.cartService.items().length > 0) {
      this.loadPayPalScript();
    }
  }

  private loadPayPalScript() {
    // Check if script already exists to avoid duplicates
    if (document.getElementById('paypal-sdk-script')) {
      this.initializePayPal();
      return;
    }

    const script = document.createElement('script');
    script.id = 'paypal-sdk-script';
    script.src = `https://www.paypal.com/sdk/js?client-id=Af4urSLoWfjiONwfyEPkIA562T3mLNAoZYYPH9FVYPCODTikgx4dGMbsT3jm1i4brzV3JTRL8CTl_c1Z&currency=USD`;
    script.onload = () => this.initializePayPal();
    document.body.appendChild(script);
  }

  private initializePayPal() {
    // Ensure paypal object exists
    if (typeof paypal === 'undefined') return;

    const totalInUSD = (this.cartService.totalPrice() / 50).toFixed(2); // Convert EGP to USD (approximate rate)

    paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: totalInUSD,
                  currency_code: 'USD',
                },
                description: 'BarberShop Products',
              },
            ],
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            this.handleOrderCreation('PayPal');
          });
        },
        onError: (err: any) => {
          console.error('PayPal Error:', err);
          this.toastService.error(this.t().error, this.t().paymentFailed);
          this.isProcessing.set(false);
        },
      })
      .render('#paypal-button-container');
  }

  placeCashOrder() {
    this.showConfirmationModal.set(true);
  }

  closeModal() {
    this.showConfirmationModal.set(false);
  }

  confirmCashOrder() {
    this.closeModal();
    this.handleOrderCreation('Cash');
  }

  private handleOrderCreation(paymentMethod: string) {
    this.isProcessing.set(true);

    // Create order for backend
    const orderItems: OrderItemDto[] = this.cartService.items().map((item) => ({
      productId: item.productId,
      name: item.productName,
      quantity: item.quantity,
      price: item.price,
    }));

    // Get actual user ID from AuthService
    const userId = this.authService.userId || this.authService.currentUser()?.id || 'guest';

    const order: CreateOrderRequest = {
      userId: userId,
      phoneNumber: this.cartService.checkoutPhone(),
      address: this.cartService.checkoutAddress(),
      customerName: localStorage.getItem('fullName') || 'Guest', // Retrieve from localStorage
      paymentMethod: paymentMethod,
      items: orderItems,
    };

    // Send order to backend
    this.orderService.createOrder(order).subscribe({
      next: (createdOrder) => {
        console.log('Order created:', createdOrder);
        this.cartService.clearCart();

        const message =
          paymentMethod === 'PayPal' ? this.t().paymentSuccess : this.t().orderPlacedSuccess;

        this.toastService.success(this.t().success, message);
        this.router.navigate(['/my-history']);
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.toastService.error(this.t().error, this.t().orderError);
        this.isProcessing.set(false);
      },
    });
  }
}
