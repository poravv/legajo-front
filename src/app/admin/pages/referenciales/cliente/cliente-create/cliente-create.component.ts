import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormGroup,
  NonNullableFormBuilder,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Observer, Subscription } from 'rxjs';
import { ClienteService } from 'src/app/admin/services/cliente/cliente.service';
import { MessageService } from 'src/app/admin/utils/message.service';
import { CiudadModel } from '../../ciudad/ciudad.component';
import { CiudadService } from 'src/app/admin/services/ciudad/ciudad.service';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Buffer } from 'buffer';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-cliente-create',
  templateUrl: './cliente-create.component.html',
  styleUrls: ['./cliente-create.component.css'],
})
export class ClienteCreateComponent implements OnInit {
  title: string = "";
  selectedValue = null;
  validateForm: FormGroup;
  ciudades: CiudadModel[] = [];
  loading = false;
  avatarUrl?: string;
  file?: string;
  image?: any;
  idcliente: string;
  createCliente: boolean = true;

  constructor(
    private fb: NonNullableFormBuilder,
    private clienteService: ClienteService,
    private messageService: MessageService,
    private router: Router,
    private ciudadService: CiudadService,
    private msg: NzMessageService,
    private activatedRoute: ActivatedRoute
  ) {

    this.idcliente = this.activatedRoute.snapshot.paramMap.get('idcliente') ?? "";

    this.validateForm = this.fb.group({
      idcliente: [0],
      razon_social: ['', [Validators.required]],
      ruc: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      img: [''],
      correo: [''],
      lat: [''],
      long: [''],
      idciudad: ['', [Validators.required]],
      tipo_cli: ['', [Validators.required]],
      sexo: [''],
      comision: [0.0],
      ciudad: [''],
    });
  }

  ngOnInit(): void {
    this.getAllCiudad();
    //console.log(this.idcliente)
    if (this.idcliente == "") {
      this.title = 'Agregar cliente';
      this.createCliente = true;
    } else {
      this.title = 'Editar cliente';
      this.createCliente = false;
      this.searchClient();
    }
  }

  searchClient() {
    this.clienteService.getClienteByPk(this.idcliente).subscribe((cliente) => {

      if (cliente.body.img) {
        const base64String = Buffer.from(cliente.body.img).toString('ascii');
        this.avatarUrl = base64String;
        //console.log(typeof Buffer.from(cliente.body.img).toString('ascii').toString())
      }

      this.validateForm.patchValue({
        idcliente: cliente.body.idcliente,
        razon_social: cliente.body.razon_social,
        ruc: cliente.body.ruc,
        telefono: cliente.body.telefono,
        direccion: cliente.body.direccion,
        estado: cliente.body.estado,
        img: Buffer.from(cliente.body.img).toString('ascii').toString(),
        correo: cliente.correo,
        lat: cliente.body.lat,
        long: cliente.body.long,
        idciudad: cliente.body.idciudad,
        tipo_cli: cliente.body.tipo_cli,
        sexo: cliente.body.sexo,
        comision: cliente.body.comision,
        ciudad: cliente.body.ciudad
      });
    });
  }

  processSubmit() {
    this.validateForm.markAllAsTouched();
    // Validate form
    if (!this.validateForm.valid) {
      this.messageService.createMessage('warning', "Complete campos requeridos");
      return;
    }
    // Create or Update
    const saveFunction = (create: boolean) => (create ? this.create() : this.update());
    saveFunction(this.createCliente);
  }

  create(): void {
    this.clienteService.createCliente(this.validateForm.value).subscribe((response) => {
      //console.log(response);
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
        this.validateForm.reset();
      }
    });
    //console.log('submit', this.validateForm.value);
  }

  update(): void {

    //console.log(this.validateForm.value)
    
    this.clienteService.updateCliente(this.validateForm.value,this.idcliente).subscribe((response) => {
      //console.log(response);
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
        this.validateForm.reset();
      }
    });
    //console.log('submit', this.validateForm.value);
  }

  getAllCiudad() {
    this.ciudadService.getCiudad().subscribe({
      next: (response) => {
        if (response) {
          response.body.map((data: CiudadModel) => {
            this.ciudades.push(data);
          });
        }
        //console.log(this.ciudades)
      },
    });
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
  }

  volver(e: MouseEvent): void {
    e.preventDefault();
    this.router.navigateByUrl('/cliente/list');
  }

  userNameAsyncValidator: AsyncValidatorFn = (control: AbstractControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value.length <= 2) {
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }


  decodeImage(imagen: any) {
    const base64String = Buffer.from(imagen.data).toString('ascii');
    this.avatarUrl = base64String;
  }

  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      default:
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;
          this.avatarUrl = img;
        });
        break;
    }
  }

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.msg.error('Tu archivo no es un jpeg o png!');
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

  customUploadReq = (item: NzUploadXHRArgs) => {
    const file = item.file as NzUploadFile;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Aquí puedes manejar la cadena base64 como necesites
      this.image = base64;
      //this.personaData.photo = base64;
      this.validateForm.patchValue({
        img: base64
      });

      if (item.onSuccess) {
        item.onSuccess({}, item.file, {});
      }
    }
    reader.readAsDataURL(file as unknown as Blob);
    return new Subscription();
  }

}
