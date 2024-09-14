import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environments';

const baseURL = environment.serverUrl + '/pago';

@Injectable({
  providedIn: 'root'
})

export class CuotaService {
  constructor(private oauthService: OAuthService, private httpClient: HttpClient) { }

  getCuota(): Observable<any> {
    //console.log(this.oauthService.getAccessToken());
    return this.httpClient.get(`${baseURL}/get`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }

  obtenerDeudas(idventa: string): Observable<any> {
    //console.log(this.oauthService.getAccessToken());
    return this.httpClient.get(`${baseURL}/getdeuda/${idventa}`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }

  procesarPagos(pagos: any[]): Observable<any> {
    return this.httpClient.post(`${baseURL}/post`, {pagos}, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        //'Access-Control-Allow-Origin': '*',
      }
    });
  }

}
