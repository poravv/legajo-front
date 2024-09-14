import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/admin/utils/message.service';
import { CiudadModel } from '../ciudad/ciudad.component';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Observer, Subscription } from 'rxjs';
import { CiudadService } from 'src/app/admin/services/ciudad/ciudad.service';
import { NACIONALIDAD } from 'src/app/admin/utils/nacionalidades';
import { PersonaService } from 'src/app/admin/services/persona/persona.service';
import { LegajoService } from 'src/app/admin/services/legajo/legajo.service';
import { AsesorModel } from '../asesor/asesor.component';
import { AuthService } from 'src/app/admin/services/auth/auth.service';

export interface ImagenBuffer {
  type: string,
  data: number[]
}

export interface LegajoModel {
  idlegajo: string;
  descripcion: string;
  detalle: string;
  estado: string;
  img: ImagenBuffer
  idpersona: number;
}

export interface PersonaModel {
  idpersona: number;
  nombre: string;
  apellido: string;
  nacimiento: Date;
  est_civil: string;
  sexo: string;
  documento: string;
  direccion: string;
  photo: ImagenBuffer;
  tipo_doc: string;
  nacionalidad: string;
  correo: string;
  telefono: string;
  idciudad: string;
  cod_asesor: number;
  ciudad: CiudadModel,
  legajos: LegajoModel[],
  estado: string;
  asesor: AsesorModel
}

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})

export class PersonaComponent implements OnInit {
  loading = false;
  avatarUrl?: string;
  file?: string;
  image?: any;
  editCache: { [key: string]: { edit: boolean; data: LegajoModel } } = {};
  listOfData: PersonaModel[] = [];
  searchValue = '';
  visible = false;
  listOfDisplayData: PersonaModel[] = [];
  allCiudad?: CiudadModel[];

  expandSet = new Set<number>();

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  //Para paginacion
  totalItems = 0;
  pageSize = 100;
  pageIndex = 1;

  constructor(
    private personaService: PersonaService,
    private legajoService: LegajoService,
    private messageService: MessageService,
    private msg: NzMessageService,
    private ciudadService: CiudadService,
    private authService: AuthService
  ) {

   }

  ngOnInit(): void {
    const roles = this.authService.getUserRoles();
    if(roles.includes('admin')){
      this._loadAllPersonas();
    }else{
      this._loadPersonasFromCodeAsesor();
    }


    
    this._loadAllCiudad();
  }

  openWhatsApp(telefono: string): void {
    let numeroNormalizado = telefono;
  
    // Si el número empieza con 0 (por ejemplo, 0981), lo reemplazamos con el prefijo internacional
    if (telefono.startsWith('0')) {
      numeroNormalizado = '595' + telefono.slice(1);
    }
  
    // Generar el enlace para WhatsApp
    const link = `https://wa.me/${numeroNormalizado}`;
  
    // Abrir en una nueva pestaña
    window.open(link, '_blank');
  }
  

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 3000 / 3000 < 2;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 3MB!');
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
      //console.log('Base64 Image:', base64);
      this.image = base64;
      if (item.onSuccess) {
        item.onSuccess({}, item.file, {});
      }

    };

    reader.readAsDataURL(file as unknown as Blob);

    return new Subscription();
  };

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);

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

  startEdit(idlegajo: string): void {
    this.editCache[idlegajo].edit = true;
  }

  cancelEdit(idlegajo: string): void {
    for (const item of this.listOfData) {
      const legajoIndex = item.legajos.findIndex(legajo => legajo.idlegajo === idlegajo);
      if (legajoIndex !== -1) {
        this.editCache[idlegajo] = {
          data: { ...item.legajos[legajoIndex] },
          edit: false
        };
        break;
      }
    }
  }
  

  searchTotal(search: string) {
    const targetValue: any[] = [];
    this.listOfData.forEach((value: any) => {
      let keys = Object.keys(value);
      for (let i = 0; i < keys.length; i++) {
        if (value[keys[i]] && value[keys[i]].toString().toLocaleLowerCase().includes(search.toLocaleLowerCase())) {
          targetValue.push(value);
          break;
        }
      }
    });
    this.listOfDisplayData = targetValue;
  }

  /*Ajustar para que el save viaje a la api de persistencia*/
  saveEdit(idlegajo: string): void {
 
    for (const persona of this.listOfData) {
      const legajoIndex = persona.legajos.findIndex(legajo => legajo.idlegajo === idlegajo);
      if (legajoIndex !== -1) {
        const legajo = persona.legajos[legajoIndex];
        Object.assign(legajo, this.editCache[idlegajo].data);

        legajo.img=this.image;

        // Actualizar el legajo
        this.legajoService.updateLegajo(legajo).subscribe((response) => {
          if (response.mensaje === 'error') {
            this.messageService.createMessage('error', response.detmensaje);
          } else {
            this.messageService.createMessage('success', response.detmensaje);
          }
        });
  
        this.editCache[idlegajo].edit = false;
        break; // Salir del bucle una vez encontrado y actualizado el legajo
      }
    }
  }
  


  updateEditCache(): void {
    this.listOfData.forEach(item => {
      item.legajos.forEach(legajo => {
        this.editCache[legajo.idlegajo.toString()] = {
          edit: false,
          data: { ...legajo }
        };
      });
    });
  }
  

  deleteRow(idpersona: number): void {
    this.listOfData = this.listOfData.filter(d => d.idpersona !== idpersona);
    this.listOfDisplayData = this.listOfData;
    const update = {
      idpersona:idpersona,
      estado:'IN'
    }
    this.personaService.updatePersona(update).subscribe((response) => {
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });
  }

  deleteRowLegajo(idlegajo: string): void {
    const update = {
      idlegajo:idlegajo,
      estado:'IN'
    }
    this.legajoService.updateLegajo(update).subscribe((response) => {
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });

  }

  _loadAllPersonas(): void {
    this.loading = true;
    this.getAllpersona(this.pageIndex);
  }

  _loadPersonasFromCodeAsesor() {
    this.loading = true;
    //this.personaService.getPersonaPage(page,this.pageSize).subscribe(response =>{
      this.personaService.getPersonaForAsesorCode().subscribe(response =>{

        if (response) {
          this.listOfData = [...this.listOfData, ...response.body];
          this.totalItems = response.pagination ? response.pagination.totalItems : this.listOfData.length;
          this.pageIndex++;
          // Si hay más registros, cargar la siguiente página
          if (this.listOfData.length < this.totalItems) {
            this.getAllpersona(this.pageIndex);
          } else {
            this.loading = false;
          }
          this.listOfDisplayData = [...this.listOfData];
          this.updateEditCache();
        }
    },error => {
      this.loading = false;
      console.error('Error al cargar los datos:', error);
    });
  }

  getAllpersona(page: number) {
    this.loading = true;
    //this.personaService.getPersonaPage(page,this.pageSize).subscribe(response =>{
      this.personaService.getPersona().subscribe(response =>{

        if (response) {
          this.listOfData = [...this.listOfData, ...response.body];
          this.totalItems = response.pagination ? response.pagination.totalItems : this.listOfData.length;
          this.pageIndex++;
          // Si hay más registros, cargar la siguiente página
          if (this.listOfData.length < this.totalItems) {
            this.getAllpersona(this.pageIndex);
          } else {
            this.loading = false;
          }
          this.listOfDisplayData = [...this.listOfData];
          this.updateEditCache();
        }
    },error => {
      this.loading = false;
      console.error('Error al cargar los datos:', error);
    });
  }

  _loadAllCiudad() {
    this.ciudadService.getCiudad().subscribe((data) => {
      this.allCiudad = data.body
    });
  }

  ciudadComparator = (ciudad: CiudadModel, other: CiudadModel): boolean => {
    return ciudad && other ? ciudad.idciudad === other.idciudad : ciudad === other;
  }

}
