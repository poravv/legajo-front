import { Injectable, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable } from 'rxjs';
import { PersonaService } from '../persona/persona.service';
import { PersonaModel } from '../../pages/referenciales/persona/persona.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  private personasSubject = new BehaviorSubject<PersonaModel[]>([]);
  personas$ = this.personasSubject.asObservable();

  constructor(private oauthService: OAuthService,private personaService: PersonaService) {
    // Cargar la notificación cuando el token es válido
    if (this.oauthService.hasValidAccessToken()) {
      console.log('Entra en hasValidAccessToken')
      this.cargarNotificacionAgendamiento();
    } else {
      console.log('Entra en else')
      // Escuchar el evento del token cuando es recibido
      this.oauthService.events.subscribe(event => {
        if (event.type === 'token_received') {
          this.cargarNotificacionAgendamiento();
        }
      });
    }
  }

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

  cargarNotificacionAgendamiento(): void {
    this.personaService.getPersonaAgendamiento().subscribe(
      (data) => {
        const personas = data.body;
        this.personasSubject.next(personas); 
      },
      (error) => {
        console.error('Error al obtener agendamientos', error);
      }
    );
  }
}
