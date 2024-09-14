import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environments';

const baseURL = environment.serverUrl + '/producto_final';

@Injectable({
  providedIn: 'root'
})

export class ProductoFinalService {
  constructor(private oauthService: OAuthService, private httpClient: HttpClient) { }

  getProductoFinal(): Observable<any> {
    //console.log(this.oauthService.getAccessToken());
    return this.httpClient.get(`${baseURL}/get`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }
  
  getProductoVenta(): Observable<any> {
    //console.log(this.oauthService.getAccessToken());
    return this.httpClient.get(`${baseURL}/productoventa`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }

  getProductoFinalByPk(idproducto_final: string): Observable<any> {
    //console.log(this.oauthService.getAccessToken());
    return this.httpClient.get(`${baseURL}/get/${idproducto_final}`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }

  createProductoFinal(newData: []): Observable<any> {
    return this.httpClient.post(`${baseURL}/post`, newData, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        //'Access-Control-Allow-Origin': '*',
      }
    });
  }

  updateProductoFinal(newData: any): Observable<any> {
    //console.log(newData)
    return this.httpClient.put(`${baseURL}/put/${newData.idproducto_final}`, newData, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        //'Access-Control-Allow-Origin': '*',
      }
    });
  }

  inactivaProductoFinal(newData: any): Observable<any> {
    //console.log(newData)
    return this.httpClient.put(`${baseURL}/inactiva/${newData.idproducto_final}`, { estado: "IN" }, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        //'Access-Control-Allow-Origin': '*',
      }
    });
  }

  deleteProductoFinal(idproducto_final: number): Observable<any> {
    //console.log(newData)
    return this.httpClient.delete(`${baseURL}/del/${idproducto_final}`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        //'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
