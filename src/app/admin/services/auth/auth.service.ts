import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private oauthService: OAuthService) {}

  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return roles.some(role => userRoles.includes(role));
  }

  getUserRoles(): string[] {
    const claims = this.oauthService.getIdentityClaims() as any;
    return claims ? claims.role : [];
  }

  async getUserRolesAsync(): Promise<string[]> {
    const claims = this.oauthService.getIdentityClaims() as any;
    return claims ? claims.role : [];
  }
}
