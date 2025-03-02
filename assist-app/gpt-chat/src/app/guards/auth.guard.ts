import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      map(user => {
        if (user) {
          return true; // ✅ User is logged in, allow access
        } else {
          this.router.navigate(['/login']); // 🚨 Redirect to login if not authenticated
          return false;
        }
      })
    );
  }
}
