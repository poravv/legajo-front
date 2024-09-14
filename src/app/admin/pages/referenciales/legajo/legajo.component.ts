import { Component, OnInit } from '@angular/core';
import { LegajoService } from 'src/app/admin/services/legajo/legajo.service';
import { MessageService } from 'src/app/admin/utils/message.service';

export interface LegajoModel {
  idlegajo: string;
  descripcion: string;
  estado: string;
}

@Component({
  selector: 'app-legajo',
  templateUrl: './legajo.component.html',
  styleUrls: ['./legajo.component.css']
})

export class LegajoComponent implements OnInit {

  constructor(private legajoService: LegajoService, private messageService: MessageService) { }

  editCache: { [key: string]: { edit: boolean; data: LegajoModel } } = {};
  listOfData: LegajoModel[] = [];
  searchValue = '';
  visible = false;
  listOfDisplayData: LegajoModel[] = [];

  startEdit(idlegajo: string): void {
    this.editCache[idlegajo].edit = true;
  }

  cancelEdit(idlegajo: string): void {
    const index = this.listOfData.findIndex(item => item.idlegajo === idlegajo);
    this.editCache[idlegajo] = {
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
    this.listOfDisplayData = this.listOfData.filter((item: LegajoModel) => item.estado.toUpperCase().indexOf(this.searchValue.toUpperCase()) !== -1);
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
    const index = this.listOfData.findIndex(item => item.idlegajo === idlegajo);
    Object.assign(this.listOfData[index], this.editCache[idlegajo].data);
    //console.log(this.listOfData[index]);
    this.legajoService.updateLegajo(this.listOfData[index]).subscribe((response) => {
      //console.log(response);
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });
    this.listOfData[index]
    this.editCache[idlegajo].edit = false;
  }

  updateEditCache(): void {
    this.listOfData.forEach(item => {
      this.editCache[item.idlegajo.toString()] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  deleteRow(idlegajo: string): void {
    this.listOfData = this.listOfData.filter(d => d.idlegajo !== idlegajo);
    this.listOfDisplayData = this.listOfData;
    this.legajoService.deleteLegajo(idlegajo).subscribe((response) => {
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });

  }

  ngOnInit(): void {
    this.getAllLegajo();
  }

  getAllLegajo() {
    this.legajoService.getLegajo().subscribe({
      next: (response) => {
        if (response) {
          response.body.map((data: LegajoModel) => {
            this.listOfData.push(data);
          });
          this.listOfDisplayData = [...this.listOfData];
          this.updateEditCache();
        }
      },
    });
  }

}
