import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from '../services/auth/auth.service';
import { PersonaModel } from '../pages/referenciales/persona/persona.component';
import { PersonaService } from '../services/persona/persona.service';
import { Router } from '@angular/router';
import {  Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  roles: string[] = [];
  personasCount: number = 0;
  pollingSubscription!: Subscription;
  validAgendamiento: boolean= true;

  constructor(
    private oauthService: OAuthService, 
    private authService: AuthService, 
    private router: Router) { }

  logout() {
    this.oauthService.logOut();
  }

  ngOnInit(): void {
    this.roles = this.authService.getUserRoles(); 
    this.authService.personas$.subscribe(personas => {
      this.personasCount = personas.length;
    });
  }

  hasAnyRole(roles: string[]): boolean {
    //this.loadPersonas();
    return this.authService.hasAnyRole(roles);
  }

  navigateToGestion(): void {
    this.router.navigate(['/notifications']);
  }

}
