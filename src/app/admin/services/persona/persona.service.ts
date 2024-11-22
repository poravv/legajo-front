import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environments';

const baseURL = environment.serverUrl + '/persona';

@Injectable({
  providedIn: 'root'
})

export class PersonaService {
  constructor(private oauthService: OAuthService, private httpClient: HttpClient) { }

  getPersona(): Observable<any> {
    //console.log(this.oauthService.getAccessToken());
    return this.httpClient.get(`${baseURL}/get`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }

  getGesDayPersona(page: number, pageSize: number, fechaInsert?: string): Observable<any> {
    // Obtener la fecha actual
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Añadir un 0 inicial si es necesario
  const day = currentDate.getDate().toString().padStart(2, '0'); // Añadir un 0 inicial si es necesario

  const formattedDate = `${year}-${month}-${day}`;

  // Usar la fecha actual si `fechaInsert` es nulo
  const fecha = fechaInsert || formattedDate;
    // Si `fechaInsert` está definido, agrega el parámetro en la URL; de lo contrario, no lo incluyas
    const url = `${baseURL}/gesDay?page=${page}&limit=${pageSize}${`&fecha_insert=${fecha}`}`;

    return this.httpClient.get(url, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }


  getPersonaAgendamiento(): Observable<any> {
    //console.log(this.oauthService.getAccessToken());
    return this.httpClient.get(`${baseURL}/getagendamiento`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }


  getPersonaForAsesorCode(page: number, pageSize: number): Observable<any> {
    //console.log(this.oauthService.getAccessToken());
    return this.httpClient.get(`${baseURL}/getForAsesor?page=${page}&limit=${pageSize}`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }

  getPersonaGesDayForAsesorCode(page: number, pageSize: number, fechaInsert?: string): Observable<any> {
    // Obtener la fecha actual
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Añadir un 0 inicial si es necesario
  const day = currentDate.getDate().toString().padStart(2, '0'); // Añadir un 0 inicial si es necesario

  const formattedDate = `${year}-${month}-${day}`;

  // Usar la fecha actual si `fechaInsert` es nulo
  const fecha = fechaInsert || formattedDate;
  

    // Si `fechaInsert` está definido, agrega el parámetro en la URL; de lo contrario, no lo incluyas
    const url = `${baseURL}/gesDayForAsesor?page=${page}&limit=${pageSize}${`&fecha_insert=${fecha}`}`;

    return this.httpClient.get(url, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }



  getPersonaByDoc(documento: string): Observable<any> {
    return this.httpClient.get(`${baseURL}/search_doc/${documento}`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }

  getPersonaLegajoByDoc(page: number, pageSize: number,documento: string): Observable<any> {
    return this.httpClient.get(`${baseURL}/likePersona?documento=${documento}&page=${page}&limit=${pageSize}`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }

  getPersonaLegajoAsesorByDoc(page: number, pageSize: number,documento: string): Observable<any> {
    return this.httpClient.get(`${baseURL}/likePersonaAsesor?documento=${documento}&page=${page}&limit=${pageSize}`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }

  getPersonaPage(page: number, pageSize: number): Observable<any> {
    //console.log(this.oauthService.getAccessToken());
    return this.httpClient.get(`${baseURL}/get?page=${page}&limit=${pageSize}`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
      }
    });
  }

  createPersona(newData: any): Observable<any> {
    
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Añadir un 0 inicial si es necesario
    const day = currentDate.getDate().toString().padStart(2, '0'); // Añadir un 0 inicial si es necesario
  
    const formattedDate = `${year}-${month}-${day}`;
  
    newData.fecha_insert = formattedDate;
    newData.fecha_insert = formattedDate;

    return this.httpClient.post(`${baseURL}/post`, newData, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        //'Access-Control-Allow-Origin': '*',
      }
    });
  }

  updatePersona(newData: any): Observable<any> {

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Añadir un 0 inicial si es necesario
    const day = currentDate.getDate().toString().padStart(2, '0'); // Añadir un 0 inicial si es necesario
  
    const formattedDate = `${year}-${month}-${day}`;
  
    newData.fecha_insert = formattedDate;

    //console.log(newData)
    return this.httpClient.put(`${baseURL}/put/${newData.idpersona}`, newData, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        //'Access-Control-Allow-Origin': '*',
      }
    });
  }

  deletePersona(idpersona: number): Observable<any> {
    //console.log(newData)
    return this.httpClient.delete(`${baseURL}/del/${idpersona}`, {
      headers: {
        'Authorization': `Bearer ${this.oauthService.getAccessToken()}`,
        //'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
