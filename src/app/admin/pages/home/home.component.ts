import { Component } from '@angular/core';
import { PersonaService } from '../../services/persona/persona.service';
import { PersonaModel } from '../referenciales/persona/persona.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class homeComponent {
  personas: PersonaModel[] = [];

  constructor(private personaService: PersonaService) {}

  ngOnInit(): void {
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
