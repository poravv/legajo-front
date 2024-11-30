import { Component, OnInit } from '@angular/core';
import { PersonaService } from '../../services/persona/persona.service';
import { PersonaModel } from '../referenciales/persona/persona.component';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { MessageService } from '../../utils/message.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent{
  personas: PersonaModel[] = [];

  personaData: any = {};
  documentStatus: boolean = false;
  loading = false;
  validateForm: FormGroup;
  selectedIndex = 0;

  constructor(
    private fb: NonNullableFormBuilder,
    private personaService: PersonaService,
    private messageService: MessageService
  ) 
  {
    this.validateForm = this.fb.group({
      nombre: ['', [Validators.required],],
      apellido: ['', [Validators.required],],
      nacimiento: ['', [Validators.required],],
      sexo: ['', [Validators.required],],
      est_civil: ['', [Validators.required],],
      documento: ['', [Validators.required],],
      estado: ['', [Validators.required],],
      direccion: ['', [Validators.required],],
      cod_asesor: [''],
      photo: [''],
      tipo_doc: ['', [Validators.required],],
      nacionalidad: ['', [Validators.required],],
      correo: [''],
      fecha_agendamiento: [''],
      telefono: ['', [Validators.required]],
      idciudad: ['', [Validators.required]],
    });
  }

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

  actualizarEstado(status: any) {
    //console.log(status)
    this.documentStatus = status;
  }

  actualizarModelo(personaData: any) {
    // Aquí puedes hacer lo que necesites con el modelo actualizado
    this.personaData = personaData;
    this.validateForm.patchValue(personaData);
  }

  changeTab(index: number): void {
    this.selectedIndex = index;
  }

  submitForm(): void {
    this.personaService.createPersona(this.personaData).subscribe((response) => {
      //console.log(response);
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
        this.validateForm.reset();
      }
    });
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    this.documentStatus = false;
    this.personaData = {};
  }

  volver(e: MouseEvent): void {
    e.preventDefault();
    //this.router.navigateByUrl('/cliente/list');
    //this.location.back();
    this.changeTab(0);
  }

}
