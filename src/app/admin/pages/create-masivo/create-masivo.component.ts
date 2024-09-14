import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreateMasivoService } from 'src/app/admin/services/masivo/create-masivo.service';
import { MessageService } from 'src/app/admin/utils/message.service';
import * as myJson from 'src/assets/fileStructure/estructura.json';

@Component({
  selector: 'app-create-masivo',
  templateUrl: './create-masivo.component.html',
  styleUrls: ['./create-masivo.component.scss']
})
export class CreateMasivoComponent implements OnInit {
  registros: any[] = []; // Arreglo para almacenar los registros del archivo CSV
  progreso = 0; // Inicializa el progreso en 0
  estructura !: any;
  archivoJson !: any[];
  totalRegistros!:number;
  coleccion:any[]=[];
  entidad!:any;
  omitidos:number=0;
  aceptados:number=0;
  type:string="";

  constructor(private route: ActivatedRoute,private createMasivoService:CreateMasivoService,private messageService:MessageService) { }

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
        this.estructura=this.archivoJson[i].estructura[0];
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
    this.entidad = this.crearObjetos(this.coleccion, this.estructura);
  }

  async procesarRegistros(){
    if(this.entidad==null) return;
    //Se genera el bucle para la creacion de los registros
    for (let i = 0; i < this.entidad.length; i++) {
      // Lógica para crear el registro (simulada con espera)
      await this.simularEspera(50); // Espera de 100 ms (ajusta según tus necesidades)
      //console.log(this.type)
      this.createMasivoService.create(this.entidad[i], this.type).subscribe((response) => {
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
        //console.log(this.coleccion[index]);
        this.omitidos++;
      }else{
        this.aceptados++
      }
    })
  }


  crearObjetos(datos: any[], titulos: string[]): any[] {
    return datos.map(item => {
      const objeto: any = {};
      titulos.forEach((titulo, index) => {
        objeto[titulo] = item[index];
      });
      return objeto;
    });
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
