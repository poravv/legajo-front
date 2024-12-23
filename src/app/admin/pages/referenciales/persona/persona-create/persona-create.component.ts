import { Location } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { PersonaService } from 'src/app/admin/services/persona/persona.service';
import { MessageService } from 'src/app/admin/utils/message.service';


@Component({
  selector: 'app-persona-create',
  templateUrl: './persona-create.component.html',
  styleUrls: ['./persona-create.component.css'],
})
export class PersonaCreateComponent{
  
  personaData: any = {};
  documentStatus: boolean = false;
  loading = false;

  selectedValue = null;
  validateForm: FormGroup;

  constructor(
    private fb: NonNullableFormBuilder,
    private personaService: PersonaService,
    private messageService: MessageService,
    private router: Router,
    private location: Location
  ) {
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
  

  actualizarEstado(status: any) {
    //console.log(status)
    this.documentStatus = status;
  }

  actualizarModelo(personaData: any) {
    // Aquí puedes hacer lo que necesites con el modelo actualizado
    this.personaData = personaData;
    this.validateForm.patchValue(personaData);
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
    this.location.back();
  }

}
