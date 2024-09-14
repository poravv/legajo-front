import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environments'; 



@Injectable({
  providedIn: 'root'
})

export class CreateMasivoService {
  
  constructor(private oauthService: OAuthService, private httpClient: HttpClient) { }

  create(newData:[],entidad:string):Observable<any> {
    const baseURL = environment.serverUrl+'/'+entidad;
    return this.httpClient.post(`${baseURL}/post`,newData, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        //'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
