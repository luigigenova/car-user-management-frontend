import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Authentication guard to protect routes requiring login.
 * Ensures that the user is authenticated before accessing the route.
 * Redirects unauthenticated users to the login page, preserving the intended destination.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly sessionTimeout = 10 * 60 * 1000; // 10 minutes session timeout

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.authService.getToken();
    const lastLoginTime = this.authService.getLastLoginTime();

    if (token && this.authService.isLoggedIn()) {
      const currentTime = Date.now();

      // Check if session is valid
      if (lastLoginTime && currentTime - lastLoginTime < this.sessionTimeout) {
        this.authService.updateLastLoginTime(); // Refresh session time
        return true; // Allow access
      } else {
        this.authService.logout();
        this.redirectToLogin(state.url); // Redirect to login if session expired
        return false;
      }
    }

    // Redirect to login if not authenticated
    this.redirectToLogin(state.url);
    return false;
  }

  private redirectToLogin(returnUrl: string): void {
    this.router.navigate(['/login'], { queryParams: { returnUrl } });
  }
}
