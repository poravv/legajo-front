import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CiudadModel } from '../../ciudad/ciudad.component';
import { NACIONALIDAD } from 'src/app/admin/utils/nacionalidades';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Observable, Observer, Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CiudadService } from 'src/app/admin/services/ciudad/ciudad.service';
import { Buffer } from 'buffer';
import { PersonaService } from 'src/app/admin/services/persona/persona.service';
import { AsesorModel } from '../../asesor/asesor.component';
import { AsesorService } from 'src/app/admin/services/asesor/asesor.service';
import { AuthService } from 'src/app/admin/services/auth/auth.service';

@Component({
  selector: 'app-persona-create-template',
  templateUrl: './persona-create-template.component.html',
  styleUrls: ['./persona-create-template.component.scss']
})
export class PersonaCreateTemplateComponent implements OnInit {
  roles: string[] = [];
  @Input() personaData: any = {};
  @Input() documentStatus: boolean = false;
  @Output() ngModelChange = new EventEmitter<any>();
  @Output() ngModelChangeStatus = new EventEmitter<any>();

  selectedIndex = 0;
  loading = false;
  avatarUrl?: string;
  file?: string;
  image: any = '';
  allCiudad?: CiudadModel[];
  allAsesores?: AsesorModel[];
  nacionalidades = NACIONALIDAD;
  documento: string = '';
  selectedValue = null;

  ngOnInit(): void {
    this.roles = this.authService.getUserRoles();
    this._loadAllCiudad();
    this._loadAllAsesores();
  }


  isAdmin(): boolean {
    return this.roles.includes('admin');
  }

  changeTab(index: number): void {
    this.selectedIndex = index;
  }

  constructor(
    private personaService: PersonaService,
    private msg: NzMessageService,
    private ciudadService: CiudadService,
    private asesorService: AsesorService,
    private authService: AuthService
  ) { }

  onInputChange(): void {
    this.ngModelChange.emit(this.personaData);
  }

  onInputChangeStatus(): void {
    this.ngModelChangeStatus.emit(this.documentStatus);
  }

  searchDocument(): void {
    this.personaService.getPersonaByDoc(this.documento).subscribe(data => {
      //console.log(data.body);
      if (data.body) {
        this.personaData = data.body;
        this.documentStatus = true;
        this.changeTab(1);
        this.onInputChange();
        this.onInputChangeStatus();
        this.documento='';
        this.personaData.photo=this.decodeImage(data.body.photo);
      } else {
        this.msg.warning('No se encuentra registro!');
      }
    });
  }

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
      if (!isJpgOrPng) {
        this.msg.error('El formato de archivo no es compatible!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 3070 / 3070 < 2;
      if (!isLt2M) {
        this.msg.error('Tu archivo supera los 3MB');
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
      this.personaData.photo = base64;

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

  // Manejar la eliminación del archivo
  handleRemove = (): boolean => {
    this.image = ''; // Limpiar la lista de archivos al eliminar
    this.avatarUrl = '';
    this.personaData.photo = '';
    this.onInputChange();
    return true;
  };

  _loadAllCiudad() {
    this.ciudadService.getCiudad().subscribe((data) => {
      this.allCiudad = data.body
    });
  }

  _loadAllAsesores() {
    this.asesorService.getAsesor().subscribe((data) => {
      this.allAsesores = data.body
    });
  }

  ciudadComparator = (ciudad: CiudadModel, other: CiudadModel): boolean => {
    return ciudad && other ? ciudad.idciudad === other.idciudad : ciudad === other;
  }

}
