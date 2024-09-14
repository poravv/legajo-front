import { Component, OnInit } from '@angular/core';
import { AsesorService } from 'src/app/admin/services/asesor/asesor.service';
import { MessageService } from 'src/app/admin/utils/message.service';

export interface AsesorModel {
  cod_asesor: string;
  nombre: string;
  apellido: string;
  idusuario: string;
  estado: string;
}

@Component({
  selector: 'app-asesor',
  templateUrl: './asesor.component.html',
  styleUrls: ['./asesor.component.css']
})

export class AsesorComponent implements OnInit {

  constructor(private asesorService: AsesorService, private messageService: MessageService) { }

  editCache: { [key: string]: { edit: boolean; data: AsesorModel } } = {};
  listOfData: AsesorModel[] = [];
  searchValue = '';
  visible = false;
  listOfDisplayData: AsesorModel[] = [];

  startEdit(cod_asesor: string): void {
    this.editCache[cod_asesor].edit = true;
  }

  cancelEdit(cod_asesor: string): void {
    const index = this.listOfData.findIndex(item => item.cod_asesor === cod_asesor);
    this.editCache[cod_asesor] = {
      data: { ...this.listOfData[index] },
      edit: false
    };
  }

  reset(): void {

    this.searchValue = '';
    this.search();
    //this.nombre='';
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfData.filter((item: AsesorModel) => item.estado.toUpperCase().indexOf(this.searchValue.toUpperCase()) !== -1);
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
  saveEdit(cod_asesor: string): void {
    const index = this.listOfData.findIndex(item => item.cod_asesor === cod_asesor);
    Object.assign(this.listOfData[index], this.editCache[cod_asesor].data);
    //console.log(this.listOfData[index]);
    this.asesorService.updateAsesor(this.listOfData[index]).subscribe((response) => {
      //console.log(response);
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });
    this.listOfData[index]
    this.editCache[cod_asesor].edit = false;
  }

  updateEditCache(): void {
    this.listOfData.forEach(item => {
      this.editCache[item.cod_asesor.toString()] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  deleteRow(cod_asesor: string): void {
    this.listOfData = this.listOfData.filter(d => d.cod_asesor !== cod_asesor);
    this.listOfDisplayData = this.listOfData;
    this.asesorService.deleteAsesor(cod_asesor).subscribe((response) => {
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });

  }

  ngOnInit(): void {
    this.getAllAsesor();
  }

  getAllAsesor() {
    this.asesorService.getAsesor().subscribe({
      next: (response) => {
        if (response) {
          response.body.map((data: AsesorModel) => {
            this.listOfData.push(data);
          });
          this.listOfDisplayData = [...this.listOfData];
          this.updateEditCache();
        }
      },
    });
  }

}
