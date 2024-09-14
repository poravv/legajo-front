import { Component, OnInit } from '@angular/core';
import { CiudadService } from 'src/app/admin/services/ciudad/ciudad.service';
import { MessageService } from 'src/app/admin/utils/message.service';

export interface CiudadModel {
  idciudad: string;
  descripcion: string;
  estado: string;
}

@Component({
  selector: 'app-ciudad',
  templateUrl: './ciudad.component.html',
  styleUrls: ['./ciudad.component.css']
})

export class CiudadComponent implements OnInit {

  constructor(private ciudadService: CiudadService, private messageService: MessageService) { }

  editCache: { [key: string]: { edit: boolean; data: CiudadModel } } = {};
  listOfData: CiudadModel[] = [];
  searchValue = '';
  visible = false;
  listOfDisplayData: CiudadModel[] = [];

  startEdit(idciudad: string): void {
    this.editCache[idciudad].edit = true;
  }

  cancelEdit(idciudad: string): void {
    const index = this.listOfData.findIndex(item => item.idciudad === idciudad);
    this.editCache[idciudad] = {
      data: { ...this.listOfData[index] },
      edit: false
    };
  }

  reset(): void {

    this.searchValue = '';
    this.search();
    //this.descripcion='';
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfData.filter((item: CiudadModel) => item.estado.toUpperCase().indexOf(this.searchValue.toUpperCase()) !== -1);
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
  saveEdit(idciudad: string): void {
    const index = this.listOfData.findIndex(item => item.idciudad === idciudad);
    Object.assign(this.listOfData[index], this.editCache[idciudad].data);
    //console.log(this.listOfData[index]);
    this.ciudadService.updateCiudad(this.listOfData[index]).subscribe((response) => {
      //console.log(response);
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });
    this.listOfData[index]
    this.editCache[idciudad].edit = false;
  }

  updateEditCache(): void {
    this.listOfData.forEach(item => {
      this.editCache[item.idciudad.toString()] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  deleteRow(idciudad: string): void {
    this.listOfData = this.listOfData.filter(d => d.idciudad !== idciudad);
    this.listOfDisplayData = this.listOfData;
    this.ciudadService.deleteCiudad(idciudad).subscribe((response) => {
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });

  }

  ngOnInit(): void {
    this.getAllCiudad();
  }

  getAllCiudad() {
    this.ciudadService.getCiudad().subscribe({
      next: (response) => {
        if (response) {
          response.body.map((data: CiudadModel) => {
            this.listOfData.push(data);
          });
          this.listOfDisplayData = [...this.listOfData];
          this.updateEditCache();
        }
      },
    });
  }

}
