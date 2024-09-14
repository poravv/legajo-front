import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/admin/services/cliente/cliente.service';
import { MessageService } from 'src/app/admin/utils/message.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ImagenBuffer } from 'src/app/admin/utils/image-decode/image-decode.component';
import { CiudadModel } from '../ciudad/ciudad.component';

export interface ClienteModel {
  idcliente: string;
  razon_social: string;
  ruc: string;
  telefono: string;
  direccion: string;
  estado: string;
  img: ImagenBuffer;
  correo: string;
  lat: string;
  long:string;
  idciudad:number;
  tipo_cli:string;
  sexo:string;
  comision:number;
  ciudad:CiudadModel
}

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})

export class ClienteComponent implements OnInit {

  constructor(private clienteService: ClienteService, private messageService: MessageService,private msg: NzMessageService) { }

  editCache: { [key: string]: { edit: boolean; data: ClienteModel } } = {};
  listOfData: ClienteModel[] = [];
  searchValue = '';
  visible = false;
  listOfDisplayData: ClienteModel[] = [];

  reset(): void {
    this.searchValue = '';
    this.search();
    //this.descripcion='';
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfData.filter((item: ClienteModel) => item.estado.toUpperCase().indexOf(this.searchValue.toUpperCase()) !== -1);
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

  updateEditCache(): void {
    this.listOfData.forEach(item => {
      this.editCache[item.idcliente.toString()] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  deleteRow(idcliente: string): void {
    this.listOfData = this.listOfData.filter(d => d.idcliente !== idcliente);
    this.listOfDisplayData = this.listOfData;
    this.clienteService.deleteCliente(idcliente).subscribe((response) => {
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });
  }

  anulaRow(idcliente:string):void {
    const index = this.listOfData.findIndex(item => item.idcliente === idcliente);
    this.listOfData[index].estado="IN"
    //console.log(this.listOfData[index]);
    this.clienteService.updateCliente(this.listOfData[index],idcliente).subscribe((response) => {
      //console.log(response);
      if (response.mensaje == 'error') {
        this.messageService.createMessage('error', response.detmensaje);
      } else {
        this.messageService.createMessage('success', response.detmensaje);
      }
    });
  }

  ngOnInit(): void {
    this.getAllCliente();
  }

  getAllCliente() {
    this.clienteService.getCliente().subscribe({
      next: (response) => {
        //console.log(response)
        if (response) {
          response.body.map((data: ClienteModel) => {
            this.listOfData.push(data);
          });
          this.listOfDisplayData = [...this.listOfData];
          this.updateEditCache();
        }
      },
    });
  }


}
