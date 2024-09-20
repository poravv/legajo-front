import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environments'; 

const baseURL = environment.serverUrl+'/persona';

@Injectable({
  providedIn: 'root'
})

export class PersonaService {
  constructor(private oauthService: OAuthService, private httpClient: HttpClient) { }

  getPersona():Observable<any> {
    //console.log(this.oauthService.getAccessToken());
    return this.httpClient.get(`${baseURL}/get`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }

  getPersonaAgendamiento():Observable<any> {
    //console.log(this.oauthService.getAccessToken());
    return this.httpClient.get(`${baseURL}/getagendamiento`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }
  

  getPersonaForAsesorCode(page:number,pageSize:number):Observable<any> {
    //console.log(this.oauthService.getAccessToken());
    return this.httpClient.get(`${baseURL}/getForAsesor?page=${page}&limit=${pageSize}`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }


  getPersonaByDoc(documento:string):Observable<any> {
    return this.httpClient.get(`${baseURL}/search_doc/${documento}`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }

  getPersonaPage(page:number,pageSize:number):Observable<any> {
    //console.log(this.oauthService.getAccessToken());
    return this.httpClient.get(`${baseURL}/get?page=${page}&limit=${pageSize}`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }

  createPersona(newData:[]):Observable<any> {
    return this.httpClient.post(`${baseURL}/post`,newData, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        //'Access-Control-Allow-Origin': '*',
      }
    });
  }

  updatePersona(newData:any):Observable<any> {
    //console.log(newData)
    return this.httpClient.put(`${baseURL}/put/${newData.idpersona}`,newData, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        //'Access-Control-Allow-Origin': '*',
      }
    });
  }

  deletePersona(idpersona:number):Observable<any> {
    //console.log(newData)
    return this.httpClient.delete(`${baseURL}/del/${idpersona}`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        //'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
