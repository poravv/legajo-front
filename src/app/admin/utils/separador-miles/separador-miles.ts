import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'thousandsSeparator'
})
export class ThousandsSeparatorPipe implements PipeTransform {

  constructor(private decimalPipe: DecimalPipe) {}

  transform(value: number | string): string | null {
    if (typeof value === 'string') {
      value = parseFloat(value);
    }
    return this.decimalPipe.transform(value, '1.2-2', 'es-ES'); // '1.2-2' para dos decimales
  }
}
