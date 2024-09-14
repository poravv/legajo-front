import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { catchError, Observable, of, Subscriber } from 'rxjs';
import { environment } from 'src/app/environment/environments';

const baseURL = environment.serverUrl + '/venta';

@Injectable({
  providedIn: 'root'
})

export class VentaService {
  constructor(private oauthService: OAuthService, private httpClient: HttpClient) { }

  getVenta(): Observable<any> {
    //console.log(this.oauthService.getAccessToken());
    return this.httpClient.get(`${baseURL}/get`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }

  getVentaUsuario(): Observable<any> {
    //console.log(this.oauthService.getAccessToken());
    return this.httpClient.get(`${baseURL}/getvenusu`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }

  getVentaByPk(idventa: string): Observable<any> {
    //console.log(this.oauthService.getAccessToken());
    return this.httpClient.get(`${baseURL}/get/${idventa}`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }

  operacionVenta(idproducto_final: string, operacion: string, cantidad: string): Observable<any> {
    //console.log(peticion);
    return this.httpClient.post(`${baseURL}/operacionventa/${idproducto_final}/${operacion}/${cantidad}`, 
      null, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        //'Access-Control-Allow-Origin': '*',
      }
    });
  }

  createVenta(newData: []): Observable<any> {
    return this.httpClient.post(`${baseURL}/post`, newData, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        //'Access-Control-Allow-Origin': '*',
      }
    });
  }

  updateVenta(newData: any): Observable<any> {
    //console.log(newData)
    return this.httpClient.put(`${baseURL}/put/${newData.idventa}`, newData, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        //'Access-Control-Allow-Origin': '*',
      }
    });
  }

  deleteVenta(idventa: number): Observable<any> {
    //console.log(newData)
    return this.httpClient.delete(`${baseURL}/del/${idventa}`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        //'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
