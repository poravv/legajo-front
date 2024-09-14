import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/admin/utils/message.service';
import * as myJson from 'src/assets/fileStructure/estructura.json';
import { DeleteMasivoService } from '../../services/masivo/delete-masivo.service';

@Component({
  selector: 'app-delete-masivo',
  templateUrl: './delete-masivo.component.html',
  styleUrls: ['./delete-masivo.component.scss']
})

export class DeleteMasivoComponent implements OnInit {
  registros: any[] = []; // Arreglo para almacenar los registros del archivo CSV
  progreso = 0; // Inicializa el progreso en 0
  estructura !: any;
  totalRegistros!:number;
  archivoJson !: any[];
  coleccion:any[]=[];
  entidad!:any;
  omitidos:number=0;
  aceptados:number=0;
  type:string="";

  constructor(private route: ActivatedRoute,private deleteMasivoService:DeleteMasivoService,private messageService:MessageService) { }

  ngOnInit(): void {
    this.archivoJson = myJson;
    this.route.params.subscribe(params => {
      this.type = params['type'];
      this.verificaEntidad(this.type);
    });
  }

  verificaEntidad(type: string) {
    //console.log(type);
    let verificacion=true;
    for(var i =0;i<this.archivoJson.length;i++){
      if(this.archivoJson[i].type==type){
        verificacion=false;
        this.estructura=this.archivoJson[i].estructura[1];
      }
    }
    if(verificacion) this.volver();
    
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.procesarFile(file);
    }
  }

  async procesarFile(file: File) {
    const text = await this.leerArchivoComoTexto(file);
    const rows = text.split(/[\r\n]+/).filter((row) => row.trim() !== '');
    this.totalRegistros = rows.length;
    let data = new Map();
    //Se mapea los registros
    rows.forEach((row, index) => {
      data.set(index,row);
    });
    //Se crea la coleccion dividiendo los datos por coma
    for (const [rowNumber, values] of data.entries()) {
      this.coleccion.push(values.split(','));
    }
    this.validaDatos();

    //Se carga los datos ya separados 
    if(this.aceptados!=0){
      this.entidad = this.coleccion;
    }
  }

  async procesarRegistros(){
    if(this.entidad==null) return;
    //Se genera el bucle para la creacion de los registros
    for (let i = 0; i < this.entidad.length; i++) {
      // Lógica para crear el registro (simulada con espera)
      await this.simularEspera(50); // Espera de 100 ms (ajusta según tus necesidades)
      //console.log(this.type)
      this.deleteMasivoService.delete(this.entidad[i], this.type).subscribe((response) => {
        //console.log(response);
        if (response.mensaje == 'error') {
          this.messageService.createMessage('error', response.detmensaje);
        }
      });

      this.progreso = Math.floor(((i + 1) / this.totalRegistros) * 100); // Actualiza el progreso
    }
  }

  volver(){
    //this.router.navigate(['../'], { relativeTo: this.route });
    window.history.back();
  }

  validaDatos(){
    this.coleccion.map(data=>{
      if(data.length!=this.estructura.length){
        this.omitidos++;
      }else{
        this.aceptados++
      }
    })
  }


  async leerArchivoComoTexto(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target?.result as string);
      };
      reader.readAsText(file);
    });
  }

  simularEspera(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
