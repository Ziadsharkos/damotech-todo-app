import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // wait until Firebase resolves the persisted user
  const user = await authService.waitForAuthReady();

  if (user) return true;

  router.navigate(['/login'], { queryParams: { redirect: state.url } });
  return false;
};
