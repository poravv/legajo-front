import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title-button',
  templateUrl: './title-button.component.html',
  styleUrls: ['./title-button.component.css']
})
export class TitleButtonComponent {
  @Input() arrayParam!: any[];
  @Input() idParam!: number;
  @Input() textParam!: string;
}
