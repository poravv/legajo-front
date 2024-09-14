import { Component } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { PersonaService } from 'src/app/admin/services/persona/persona.service';
import { MessageService } from 'src/app/admin/utils/message.service';


@Component({
  selector: 'app-persona-create',
  templateUrl: './persona-create.component.html',
  styleUrls: ['./persona-create.component.css'],
})
export class PersonaCreateComponent {
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
    private msg: NzMessageService
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
      cod_asesor: ['', [Validators.required],],
      photo: [''],
      tipo_doc: ['', [Validators.required],],
      nacionalidad: ['', [Validators.required],],
      correo: [''],
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

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

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

  resetForm(): void {
    this.validateForm.reset();
    this.documentStatus = false;
    this.personaData = {};
  }

  volver(e: MouseEvent): void {
    e.preventDefault();
    this.router.navigateByUrl('/cliente/list');
  }

}
