import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

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
}
