import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  isAuthenticated: boolean;

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.isAuthenticated = this.authService.credentials() !== null && this.authService.credentials() !== undefined;
    if (this.isAuthenticated) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
