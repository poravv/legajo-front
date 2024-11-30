import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { MessageService } from 'src/app/admin/utils/message.service';
import { CiudadModel } from '../ciudad/ciudad.component';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { forkJoin, Observable, Observer, Subscription } from 'rxjs';
import { CiudadService } from 'src/app/admin/services/ciudad/ciudad.service';
import { PersonaService } from 'src/app/admin/services/persona/persona.service';
import { LegajoService } from 'src/app/admin/services/legajo/legajo.service';
import { AsesorModel } from '../asesor/asesor.component';
import { AuthService } from 'src/app/admin/services/auth/auth.service';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export interface ImagenBuffer {
  type: string,
  data: number[]
}

export interface LegajoModel {
  idlegajo: string;
  descripcion: string;
  detalle: string;
  estado: string;
  fecha_insert: Date;
  fecha_upd: Date;
  img?: ImagenBuffer
  idpersona: number;
}

export interface PersonaModel {
  idpersona: number;
  nombre: string;
  apellido: string;
  nacimiento: string;
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
  fecha_insert: Date,
  fecha_upd: Date,
  fecha_agendamiento: Date,
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
  image: any = '';
  editCache: { [key: string]: { edit: boolean; data: LegajoModel } } = {};
  listOfData: PersonaModel[] = [];
  searchValue = '';
  visible = false;
  listOfDisplayData: PersonaModel[] = [];

  expandSet = new Set<number>();

  //Modal
  isVisible = false;
  isOkLoading = false;
  selectedPersona: PersonaModel | null = null;

  showModal(persona: PersonaModel): void {
    this.selectedPersona = persona;
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 100);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  //Para paginacion
  totalItems = 1;
  pageSize = 10;
  pageIndex = 1;

  constructor(
    private personaService: PersonaService,
    private legajoService: LegajoService,
    private messageService: MessageService,
    private msg: NzMessageService,
    private authService: AuthService,
    //private router: Router
  ) {

  }

  ngOnInit(): void {
    const roles = this.authService.getUserRoles();
    if (roles.includes('admin')) {
      this._loadAllPersonas();
    } else {
      this._loadPersonasFromCodeAsesor();
    }

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
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
      if (!isJpgOrPng) {
        this.msg.error('Tu archivo no es compatible');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 3072 / 3072 < 2;
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

  // Manejar la eliminación del archivo
  handleRemove = (): boolean => {
    this.image = '--'; // Limpiar la lista de archivos al eliminar
    this.avatarUrl = '--';
    return true;
  };

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

        if (this.image === '') {
          delete legajo.img; // Esto no causa un error de TypeScript
          //console.log('Legajo sin imagen', legajo);
        } else {
          legajo.img = this.image;
          //console.log('Legajo con imagen', legajo);
        }

        // Actualizar el legajo
        this.legajoService.updateLegajo(legajo).subscribe((response) => {
          if (response.mensaje === 'error') {
            this.messageService.createMessage('error', response.detmensaje);
          } else {
            this.messageService.createMessage('success', response.detmensaje);
            this.refreshPage();
          }
        });

        this.editCache[idlegajo].edit = false;
        break; // Salir del bucle una vez encontrado y actualizado el legajo
      }
    }
  }

  refreshPage(): void {
    window.location.reload();
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
      idpersona: idpersona,
      estado: 'BO'
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
      idlegajo: idlegajo,
      estado: 'IN'
    }
    this.legajoService.updateLegajo(update).subscribe((response) => {
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
        this.refreshPage();
      }
    });

  }

  /*
  _loadAllPersonas(): void {
    this.loading = true;
    this.getAllpersona(this.pageIndex);
  }
  */

  _loadAllPersonas(): void {
    this.loading = true;
    this.pageIndex = 1; // Reiniciar el índice de página
    this.getAllPersonasInParallel();  // Obtener el total de elementos primero
  }

  getAllPersonasInParallel(): void {
    this.personaService.getPersonaPage(this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        if (response) {
          this.totalItems = response.pagination ? response.pagination.totalItems : 0;
          const totalPages = Math.ceil(this.totalItems / this.pageSize);

          // Limitar el número de solicitudes paralelas a 10 (por ejemplo)
          const observables = [];
          for (let i = this.pageIndex; i <= totalPages; i++) {
            observables.push(this.personaService.getPersonaPage(i, this.pageSize));
          }

          // Usamos mergeMap para procesar las solicitudes en paralelo pero limitadas
          from(observables).pipe(
            mergeMap(obs => obs) // mergeMap ejecuta las peticiones en paralelo
          ).subscribe({
            next: (response) => {
              let newData: PersonaModel[] = [];
              response.body.forEach((data: PersonaModel) => {
                if (data.estado !== 'BO') {
                  newData.push(data);
                }
              });
              this.listOfData = [...this.listOfData, ...newData];
              this.listOfDisplayData = [...this.listOfData];
              this.updateEditCache();
            },
            complete: () => {
              this.loading = false;
            },
            error: (error) => {
              console.error('Error al cargar los datos:', error);
              this.loading = false;
            }
          });
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error al obtener el total de items:', error);
      }
    });
  }



  _loadPersonasFromCodeAsesor(): void {
    this.loading = true;
    this.getPersonasAsesor(this.pageIndex);
  }

  getPersonasAsesor(page: number) {
    this.loading = true;

    this.personaService.getPersonaForAsesorCode(page, this.pageSize).subscribe({
      next: (response) => {
        if (response) {
          this.totalItems = response.pagination ? response.pagination.totalItems : 0;
          const totalPages = Math.ceil(this.totalItems / this.pageSize);

          // Limitar el número de solicitudes paralelas a 10 (por ejemplo)
          const observables = [];
          for (let i = this.pageIndex; i <= totalPages; i++) {
            observables.push(this.personaService.getPersonaForAsesorCode(i, this.pageSize));
          }

          // Usamos from() y mergeMap para procesar las solicitudes en paralelo pero limitadas
          from(observables).pipe(
            mergeMap(obs => obs) // mergeMap ejecuta las peticiones en paralelo
          ).subscribe({
            next: (response) => {
              let newData: PersonaModel[] = [];
              // Filtramos los datos que no tengan estado 'IN' o 'BO'
              response.body.forEach((data: PersonaModel) => {
                if (data.estado !== 'IN' && data.estado !== 'BO') {
                  newData.push(data);
                }
              });
              // Añadir los nuevos datos a la lista sin duplicar
              this.listOfData = [...this.listOfData, ...newData];
              this.listOfDisplayData = [...this.listOfData];
              this.updateEditCache();
            },
            complete: () => {
              this.loading = false; // Finalizamos la carga
            },
            error: (error) => {
              console.error('Error al cargar los datos:', error);
              this.loading = false; // Finalizamos la carga en caso de error
            }
          });
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error al obtener el total de items:', error);
      }
    });
  }



  getAllpersona(page: number) {
    this.loading = true;

    this.personaService.getPersonaPage(page, this.pageSize).subscribe(response => {
      if (response) {
        const newData = response.body.filter((data: PersonaModel) => data.estado !== 'BO');

        // Añadir los nuevos datos a la lista sin duplicar
        this.listOfData = [...this.listOfData, ...newData];

        this.totalItems = response.pagination ? response.pagination.totalItems : this.listOfData.length;

        //console.log(`Page: ${page}, New Data Length: ${newData.length}, Total Items: ${this.totalItems}`);
        //console.log(`Current List Length: ${this.listOfData.length}`);

        // Incrementar el índice de página solo si hay más datos por cargar
        if (newData.length > 0 && this.listOfData.length < this.totalItems) {
          this.pageIndex++;
          this.getAllpersona(this.pageIndex);
        } else {
          this.loading = false;
        }

        this.listOfDisplayData = [...this.listOfData];
        this.updateEditCache();
      } else {
        this.loading = false;
      }
    }, error => {
      this.loading = false;
      console.error('Error al cargar los datos:', error);
    });
  }


  ciudadComparator = (ciudad: CiudadModel, other: CiudadModel): boolean => {
    return ciudad && other ? ciudad.idciudad === other.idciudad : ciudad === other;
  }

  listOfColumn = [
    {
      title: 'Estado',
      compare: (a: PersonaModel, b: PersonaModel) => a.estado.localeCompare(b.estado),
      priority: 0
    },
    {
      title: 'Nombre',
      compare: (a: PersonaModel, b: PersonaModel) => a.nombre.localeCompare(b.nombre),
      priority: 3
    },
    {
      title: 'Apellido',
      compare: (a: PersonaModel, b: PersonaModel) => a.apellido.localeCompare(b.apellido),
      priority: 2
    },
    {
      title: 'Documento',
      compare: (a: PersonaModel, b: PersonaModel) => a.documento.localeCompare(b.documento),
      priority: 0
    }
  ];

}
