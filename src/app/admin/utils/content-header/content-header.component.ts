import { Component, Input } from '@angular/core';
import { ExportsService } from '../exports.service';

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.css']
})
export class ContentHeaderComponent {
  @Input() title!: string;
  @Input() route!: string;
  @Input() exportExcel!: boolean;
  @Input() exportPdf!: boolean;
  @Input() dataExport!: any[];
  @Input() dataExportTitle!: string;
  @Input() buttonTitle!: string;
  @Input() masivo!: boolean;
  @Input() type!: string;

  constructor(private exportsService:ExportsService) { }

  onExportExcel(){
    this.exportsService.exportToExcel(this.dataExport,this.dataExportTitle)
  }

  onExportPdf(){
    this.exportsService.exportToPDF(this.dataExport,this.dataExportTitle)
  }

}
