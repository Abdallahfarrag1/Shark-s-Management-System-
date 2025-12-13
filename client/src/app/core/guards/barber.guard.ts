import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class BarberGuard implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean {
    if (this.auth.isBarber || this.auth.isAdmin) {
      return true;
    }

    // Redirect to home if not barber or admin
    this.router.navigate(['/']);
    return false;
  }
}
