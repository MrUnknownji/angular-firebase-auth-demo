import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn()) {
    return router.navigate(['/home']);
  } else if (authService.isRegistered() && !authService.isLoggedIn()) {
    return true
  } else {
    return router.navigate(['/signup']);
  }
};
