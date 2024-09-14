import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { agregarSeparadorMiles } from '../separador-miles/agregarSeparadorMiles';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient) { }

  mostrarTicketPago(ticketData: any): void {
    this.http.get('assets/ticket-pago-template.html', { responseType: 'text' }).subscribe(template => {
      const printWindow = window.open('', '_blank', 'width=600,height=600');

      if (printWindow) {
        let cuotasHtml = ticketData.cuotas.map((cuota: any) => `
          <tr>
            <td class="qty">${cuota.cuotaNumero}</td>
            <td class="qty">${cuota.total}</td>
            <td class="qty">${cuota.montoPagado}</td>
            <td class="qty">${cuota.montoPendiente}</td>
            <td class="qty">${cuota.vencimiento}</td>
          </tr>
        `).join('');

        let htmlContent = template
        .replace('{{negocio}}', ticketData.negocio)
          .replace('{{duenho}}', ticketData.duenho)
          .replace('{{direccion}}', ticketData.direccion)
          .replace('{{telefono}}', ticketData.telefono)
          .replace('{{email}}', ticketData.email)
          .replace('{{numeroPedido}}', ticketData.numeroPedido)
          .replace('{{fecha}}', ticketData.fecha)
          .replace('{{hora}}', ticketData.hora)
          .replace('{{cliente}}', ticketData.cliente)
          .replace('{{ruc}}', ticketData.ruc)
          .replace('{{direccion_cli}}', ticketData.direccion_cli)
          .replace('{{correo_cli}}', ticketData.correo_cli)
          .replace('{{cuotasHtml}}', cuotasHtml)
          .replace('{{delivery}}', ticketData.delivery)
          .replace('{{totalIva}}', ticketData.totalIva)
          .replace('{{total}}', ticketData.total)
          .replace('{{totalGeneral}}', ticketData.totalGeneral)
          .replace('{{situacionPedido}}', ticketData.situacionPedido)
          .replace('{{numLetra}}', ticketData.numLetra);

        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // Esperamos a que la ventana se haya cargado completamente antes de imprimir y cerrarla
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        };
      }
    });
  }



  mostrarTicketVenta(ticketData: any): void {
    this.http.get('assets/ticket-template.html', { responseType: 'text' }).subscribe(template => {
      const printWindow = window.open('', '_blank', 'width=600,height=600');
      if (printWindow) {
        let detVentaHtml = ticketData.det_venta.map((item: any) => `
                <tr>
                    <td class="qty">${item.cantidad}</td>
                    <td class="desc">${item.producto_final.nombre}</td>
                    <td class="unit">${agregarSeparadorMiles(item.producto_final.costo)}</td>
                    <td class="unit">${agregarSeparadorMiles(item.descuento)}</td>
                    <td >${agregarSeparadorMiles(item.subtotal)}</td>
                </tr>
        `).join('');

        let htmlContent = template
        .replace('{{nro}}', ticketData.nro)  
        .replace('{{negocio}}', ticketData.negocio)
          .replace('{{duenho}}', ticketData.duenho)
          .replace('{{direccion}}', ticketData.direccion)
          .replace('{{telefono}}', ticketData.telefono)
          .replace('{{email}}', ticketData.email)
          .replace('{{numeroPedido}}', ticketData.numeroPedido)
          .replace('{{fecha}}', ticketData.fecha)
          .replace('{{hora}}', ticketData.hora)
          .replace('{{cliente}}', ticketData.cliente)
          .replace('{{ruc}}', ticketData.ruc)
          .replace('{{direccion_cli}}', ticketData.direccion_cli)
          .replace('{{correo_cli}}', ticketData.correo_cli)
          .replace('{{detVentaHtml}}', detVentaHtml)
          .replace('{{delivery}}', ticketData.delivery)
          .replace('{{totalIva}}', ticketData.totalIva)
          .replace('{{total}}', ticketData.total)
          .replace('{{totalGeneral}}', ticketData.totalGeneral)
          .replace('{{situacionPedido}}', ticketData.situacionPedido)
          .replace('{{numLetra}}', ticketData.numLetra);
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        // Esperamos a que la ventana se haya cargado completamente antes de imprimir y cerrarla
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        };
      }
    });
  }

  
  mostrarTicketVentaCredito(ticketData: any): void {
    this.http.get('assets/ticket-template-credito.html', { responseType: 'text' }).subscribe(template => {
      const printWindow = window.open('', '_blank', 'width=600,height=600');
      if (printWindow) {

        let cuotasHtml = ticketData.cuotas.map((cuota: any) => `
          <tr>
            <td class="qty">${cuota.cuotaNumero}</td>
            <td class="qty">${cuota.total}</td>
            <td class="qty">${cuota.montoPagado}</td>
            <td class="qty">${cuota.montoPendiente}</td>
            <td class="qty">${cuota.vencimiento}</td>
          </tr>
        `).join('');

        let detVentaHtml = ticketData.det_venta.map((item: any) => `
                <tr>
                    <td class="qty">${item.cantidad}</td>
                    <td class="desc">${item.producto_final.nombre}</td>
                    <td class="unit">${agregarSeparadorMiles(item.producto_final.costo)}</td>
                    <td class="unit">${agregarSeparadorMiles(item.descuento)}</td>
                    <td >${agregarSeparadorMiles(item.subtotal)}</td>
                </tr>
        `).join('');

        let htmlContent = template
        .replace('{{nro}}', ticketData.nro)  
        .replace('{{negocio}}', ticketData.negocio)
          .replace('{{duenho}}', ticketData.duenho)
          .replace('{{direccion}}', ticketData.direccion)
          .replace('{{telefono}}', ticketData.telefono)
          .replace('{{email}}', ticketData.email)
          .replace('{{numeroPedido}}', ticketData.numeroPedido)
          .replace('{{fecha}}', ticketData.fecha)
          .replace('{{hora}}', ticketData.hora)
          .replace('{{cliente}}', ticketData.cliente)
          .replace('{{ruc}}', ticketData.ruc)
          .replace('{{cuotasHtml}}', cuotasHtml)
          .replace('{{direccion_cli}}', ticketData.direccion_cli)
          .replace('{{correo_cli}}', ticketData.correo_cli)
          .replace('{{detVentaHtml}}', detVentaHtml)
          .replace('{{delivery}}', ticketData.delivery)
          .replace('{{totalIva}}', ticketData.totalIva)
          .replace('{{total}}', ticketData.total)
          .replace('{{totalGeneral}}', ticketData.totalGeneral)
          .replace('{{situacionPedido}}', ticketData.situacionPedido)
          .replace('{{numLetra}}', ticketData.numLetra);
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        // Esperamos a que la ventana se haya cargado completamente antes de imprimir y cerrarla
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        };
      }
    });
  }

}
