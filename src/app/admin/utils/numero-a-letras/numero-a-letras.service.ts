import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumeroALetrasService {

  constructor() { }

  private Unidades(num: number): string {
    switch(num) {
      case 1: return "UN";
      case 2: return "DOS";
      case 3: return "TRES";
      case 4: return "CUATRO";
      case 5: return "CINCO";
      case 6: return "SEIS";
      case 7: return "SIETE";
      case 8: return "OCHO";
      case 9: return "NUEVE";
      default: return "";
    }
  }

  private DecenasY(strSin: string, numUnidades: number): string {
    return numUnidades > 0 ? `${strSin} Y ${this.Unidades(numUnidades)}` : strSin;
  }

  private Decenas(num: number): string {
    const decena = Math.floor(num / 10);
    const unidad = num % 10;

    switch(decena) {
      case 1:
        switch(unidad) {
          case 0: return "DIEZ";
          case 1: return "ONCE";
          case 2: return "DOCE";
          case 3: return "TRECE";
          case 4: return "CATORCE";
          case 5: return "QUINCE";
          default: return `DIECI${this.Unidades(unidad)}`;
        }
      case 2:
        return unidad === 0 ? "VEINTE" : `VEINTI${this.Unidades(unidad)}`;
      case 3: return this.DecenasY("TREINTA", unidad);
      case 4: return this.DecenasY("CUARENTA", unidad);
      case 5: return this.DecenasY("CINCUENTA", unidad);
      case 6: return this.DecenasY("SESENTA", unidad);
      case 7: return this.DecenasY("SETENTA", unidad);
      case 8: return this.DecenasY("OCHENTA", unidad);
      case 9: return this.DecenasY("NOVENTA", unidad);
      case 0: return this.Unidades(unidad);
      default: return "";
    }
  }

  private Centenas(num: number): string {
    const centenas = Math.floor(num / 100);
    const decenas = num % 100;

    switch(centenas) {
      case 1:
        return decenas > 0 ? `CIENTO ${this.Decenas(decenas)}` : "CIEN";
      case 2: return `DOSCIENTOS ${this.Decenas(decenas)}`;
      case 3: return `TRESCIENTOS ${this.Decenas(decenas)}`;
      case 4: return `CUATROCIENTOS ${this.Decenas(decenas)}`;
      case 5: return `QUINIENTOS ${this.Decenas(decenas)}`;
      case 6: return `SEISCIENTOS ${this.Decenas(decenas)}`;
      case 7: return `SETECIENTOS ${this.Decenas(decenas)}`;
      case 8: return `OCHOCIENTOS ${this.Decenas(decenas)}`;
      case 9: return `NOVECIENTOS ${this.Decenas(decenas)}`;
      default: return this.Decenas(decenas);
    }
  }

  private Seccion(num: number, divisor: number, strSingular: string, strPlural: string): string {
    const cientos = Math.floor(num / divisor);
    const resto = num % divisor;

    let letras = "";

    if (cientos > 0) {
      letras = cientos > 1 ? `${this.Centenas(cientos)} ${strPlural}` : strSingular;
    }

    if (resto > 0) {
      letras += "";
    }

    return letras;
  }

  private Miles(num: number): string {
    const divisor = 1000;
    const cientos = Math.floor(num / divisor);
    const resto = num % divisor;

    const strMiles = this.Seccion(num, divisor, "UN MIL", "MIL");
    const strCentenas = this.Centenas(resto);

    return strMiles === "" ? strCentenas : `${strMiles} ${strCentenas}`;
  }

  private Millones(num: number): string {
    const divisor = 1000000;
    const cientos = Math.floor(num / divisor);
    const resto = num % divisor;

    const strMillones = this.Seccion(num, divisor, "UN MILLÓN DE", "MILLONES DE");
    const strMiles = this.Miles(resto);

    return strMillones === "" ? strMiles : `${strMillones} ${strMiles}`;
  }

  public NumeroALetras(num: number): string {
    const enteros = Math.floor(num);
    const centavos = Math.round((num - enteros) * 100);

    let letrasCentavos = '';
    if (centavos > 0) {
      letrasCentavos = `CON ${this.Millones(centavos)} ${centavos === 1 ? 'Guaraní' : 'Guaraníes'}`;
    }

    if (enteros === 0) {
      return `CERO Guaraníes ${letrasCentavos}`;
    }

    let letrasEnteros = this.Millones(enteros);
    letrasEnteros = letrasEnteros ? letrasEnteros.trim() : '';
    if (enteros === 1) {
      return `${letrasEnteros} Guaraní ${letrasCentavos}`.trim();
    }
    return `${letrasEnteros} Guaraníes ${letrasCentavos}`.trim();
  }
}
