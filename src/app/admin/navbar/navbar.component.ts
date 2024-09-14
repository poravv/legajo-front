import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  roles: string[] = [];

  constructor(private oauthService: OAuthService, private authService: AuthService) { }

  logout() {
    this.oauthService.logOut();
  }

  ngOnInit(): void {
    this.roles = this.authService.getUserRoles();
  }

  isAdmin(): boolean {
    return this.roles.includes('admin');
  }

  isSales(): boolean {
    return this.roles.includes('asesor');
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return this.authService.hasAnyRole(roles);
  }
}
