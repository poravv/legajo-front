import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportsService {
  columnTitles!: string[]; // Aquí almacenaremos los títulos de las columnas

  constructor() { }
  
  exportToExcel(data: any[], filename: string): void {
    const currentDate = new Date();

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, filename + currentDate.getTime()+'.xlsx');
  }

  handleExportExcelTitle = (title:string,cabecera:any[],body:any[]) => {
    const currentDate = new Date();
    const sheet = XLSX.utils.json_to_sheet([{}], {
        header: ['Convocatoria'],//origin:'A1:P1'
    });
    const merge = [
        {
            s: {
                r: 0, c: 0,
            }, e: { r: 0, c: 13 },
        },/*{ s: { r: 3, c: 0 }, e: { r: 4, c: 0 } }*/
    ];
    sheet["!merges"] = merge;
    var wbrm = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(sheet, cabecera, { origin: "A2" });

    XLSX.utils.sheet_add_json(sheet, body, {
        origin: 'A3', skipHeader: true
    });
    XLSX.utils.book_append_sheet(wbrm, sheet, title);
    XLSX.writeFile(wbrm, `${title+currentDate.getTime()}.xlsx`)
}
  
  exportToPDF(data: any[], filename: string): void {
    const currentDate = new Date();
    const doc = new jsPDF('l', 'mm', 'a4',true);
    
    doc.text('Export', 10, 10);
    
    // Establece el tamaño de fuente más pequeño
    doc.setFontSize(10);
    this.extractColumnTitles(data);
  
    const columnWidths: number[] = [];
    this.columnTitles.forEach((title, colIndex) => {
      let maxWidth = doc.getStringUnitWidth(title) * 10; // Ancho en puntos (ajusta según tus necesidades)
      data.forEach((item) => {
        const value = item[title]?.toString() || '';
        const valueWidth = doc.getStringUnitWidth(value) * 5;
        maxWidth = Math.max(maxWidth, valueWidth);
      });
      columnWidths[colIndex] = maxWidth;
    });

    // Agrega los títulos de las columnas al PDF
    this.columnTitles.forEach((title, index) => {
      const xPosition = 10 + columnWidths.slice(0, index).reduce((sum, width) => sum + width, 0);
      doc.cell(xPosition, 20, columnWidths[index], 10, title, 0 , 'center');
    });

    // Agrega los datos al PDF
    data.forEach((item, rowIndex) => {
      Object.keys(item).forEach((title, colIndex) => {
        const xPosition = 10 + columnWidths.slice(0, colIndex).reduce((sum, width) => sum + width, 0);
        const yPosition = 30 + rowIndex * 10;
        doc.cell(xPosition, yPosition, columnWidths[colIndex], 10, item[title]?.toString() || '',rowIndex-1, 'left');
      });
    });
    // Guarda el archivo con un nombre deseado
    doc.save(filename + currentDate.getTime()+'.pdf');
    
  }

  extractColumnTitles(data:any) {
    if (data && data.length > 0) {
      // Suponemos que la primera fila contiene los títulos de las columnas
      this.columnTitles = Object.keys(data[0]);
    }
  }
  
}
