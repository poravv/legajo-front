import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from '../services/auth/auth.service';
import { PersonaModel } from '../pages/referenciales/persona/persona.component';
import { PersonaService } from '../services/persona/persona.service';
import { Router } from '@angular/router';
import { interval, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  roles: string[] = [];
  personas: PersonaModel[] = [];
  pollingSubscription!: Subscription;

  constructor(
    private oauthService: OAuthService, 
    private authService: AuthService, 
    private personaService: PersonaService,
    private router: Router) { }

  logout() {
    this.oauthService.logOut();
  }

  ngOnInit(): void {
    this.roles = this.authService.getUserRoles();
    
    if(this.hasRole('admin')){
      this.pollingSubscription = interval(2000) // 30 segundos
        .pipe(switchMap(() => this.personaService.getPersonaAgendamiento()))
        .subscribe(
          (data) => {
            this.personas = data.body;
          },
          (error) => {
            console.error('Error al obtener personas', error);
          }
        );
    }
  }


  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    //this.loadPersonas();
    return this.authService.hasAnyRole(roles);
  }

  loadPersonas(): void {
    this.personaService.getPersonaAgendamiento().subscribe(
      (data) => {
        this.personas = data.body;
      },
      (error) => {
        console.error('Error al obtener personas', error);
      }
    );
  }

  navigateToGestion(): void {
    this.router.navigate(['/notifications']);
  }

}
