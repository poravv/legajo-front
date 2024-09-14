import { Component } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormGroup,
  NonNullableFormBuilder,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Observable, Observer, Subscription } from 'rxjs';
import { LegajoService } from 'src/app/admin/services/legajo/legajo.service';
import { MessageService } from 'src/app/admin/utils/message.service';
import { Buffer } from 'buffer';

@Component({
  selector: 'app-legajo-create',
  templateUrl: './legajo-create.component.html',
  styleUrls: ['./legajo-create.component.css'],
})
export class LegajoCreateComponent {
  selectedValue = null;
  validateForm: FormGroup;
  idpersona: string = '';

  loading = false;
  avatarUrl?: string;
  file?: string;
  image?: any;

  constructor(
    private fb: NonNullableFormBuilder,
    private legajoService: LegajoService, 
    private messageService:MessageService, 
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private msg: NzMessageService,
  ) {
    
    this.idpersona = this.activatedRoute.snapshot.paramMap.get('idpersona') ?? '';

    this.validateForm = this.fb.group({
      descripcion: ['', [Validators.required]],
      detalle: ['', [Validators.required]],
      idpersona: [''],
      img: [''],
      estado: ['',[Validators.required]],
    });
  }

  submitForm(): void {
    


    if(this.idpersona=='') {
      this.messageService.createMessage('error','No se ha cargado id de persona');
      return;
    }

    this.validateForm.patchValue({
      idpersona: this.idpersona,
      img:this.image
    });

    this.legajoService.createLegajo(this.validateForm.value).subscribe((response) =>{
      //console.log(response);
      if(response.mensaje=='error'){
        this.messageService.createMessage('error',response.detmensaje);
      }else{
        this.messageService.createMessage('success',response.detmensaje);
        this.validateForm.reset();
      }
    });
    //console.log('submit', this.validateForm.value);
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
        if (control.value.length <=2) {
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });



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

  customUploadReq = (item: NzUploadXHRArgs) => {
    const file = item.file as NzUploadFile;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Aquí puedes manejar la cadena base64 como necesites
      this.image = base64;

      if (item.onSuccess) {
        item.onSuccess({}, item.file, {});
      }
    }
    reader.readAsDataURL(file as unknown as Blob);
    return new Subscription();
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }


  decodeImage(imagen:any){
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

}
