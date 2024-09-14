
export function agregarSeparadorMiles(num: number | string): string | null {
  if (num !== undefined) {
      let partesNumero = num.toString().split('.');
      partesNumero[0] = partesNumero[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      //return partesNumero.join(',');
      return partesNumero[0];
  } else {
      return null;
  }
}
