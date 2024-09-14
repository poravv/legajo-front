import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';  // Ajusta la ruta según tu estructura

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['expectedRoles'] as Array<string>;
    
    if (this.authService.hasAnyRole(expectedRoles)) {
      return true;
    }

    this.router.navigate(['/not-authorized']);  // Redirige si no tiene acceso
    return false;
  }
}
