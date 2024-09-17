import { Component, OnInit } from '@angular/core';
import { PersonaService } from '../../services/persona/persona.service';
import { PersonaModel } from '../referenciales/persona/persona.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent{
  personas: PersonaModel[] = [];

  constructor(private personaService: PersonaService) {}

  ngOnInit(): void {
    this.loadPersonas();
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

}
