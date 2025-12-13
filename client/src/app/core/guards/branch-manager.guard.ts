import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class BranchManagerGuard implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean {
    if (this.auth.isBranchManager || this.auth.isAdmin) {
      return true;
    }

    // Redirect to home if not branch manager or admin
    this.router.navigate(['/']);
    return false;
  }
}
