import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { es_ES, NZ_I18N } from 'ng-zorro-antd/i18n';
//import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
//import en from '@angular/common/locales/en';
import es from '@angular/common/locales/es';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { NavbarComponent } from './admin/navbar/navbar.component';
import { AuthConfig, OAuthService, provideOAuthClient } from 'angular-oauth2-oidc';
import { environment } from './environment/environments';
import { TitleButtonComponent } from './admin/utils/title-button/title-button.component';
import { ContentHeaderComponent } from './admin/utils/content-header/content-header.component';
import { homeComponent } from './admin/pages/home/home.component';
import { CiudadCreateComponent } from './admin/pages/referenciales/ciudad/ciudad-create/ciudad-create.component';
import { CiudadComponent } from './admin/pages/referenciales/ciudad/ciudad.component';
import { CreateMasivoComponent } from './admin/pages/create-masivo/create-masivo.component';
import { DeleteMasivoComponent } from './admin/pages/delete-masivo/delete-masivo.component';
import { ImageDecodeComponent } from './admin/utils/image-decode/image-decode.component';
import { PersonaCreateTemplateComponent } from './admin/pages/referenciales/persona/persona-create-template/persona-create-template.component';
import { PersonaCreateComponent } from './admin/pages/referenciales/persona/persona-create/persona-create.component';
import { PersonaComponent } from './admin/pages/referenciales/persona/persona.component';
import { ClienteComponent } from './admin/pages/referenciales/cliente/cliente.component';
import { ClienteCreateComponent } from './admin/pages/referenciales/cliente/cliente-create/cliente-create.component';
import { AuthService } from './admin/services/auth/auth.service';
import { DecimalPipe } from '@angular/common';
import { ThousandsSeparatorPipe } from './admin/utils/separador-miles/separador-miles';
import { LegajoComponent } from './admin/pages/referenciales/legajo/legajo.component';
import { LegajoCreateComponent } from './admin/pages/referenciales/legajo/legajo-create/legajo-create.component';
import { AsesorComponent } from './admin/pages/referenciales/asesor/asesor.component';
import { AsesorCreateComponent } from './admin/pages/referenciales/asesor/asesor-create/asesor-create.component';


registerLocaleData(es);

export const authCodeFlowConfig: AuthConfig = {
  issuer: environment.keycloakConfig.issuer,
  tokenEndpoint: environment.keycloakConfig.tokenEndpoint,
  redirectUri: window.location.origin,
  clientId: environment.keycloakConfig.clientId,
  responseType: environment.keycloakConfig.responseType,
  scope: environment.keycloakConfig.scope,
  showDebugInformation: environment.keycloakConfig.showDebugInformation,
  //dummyClientSecret:environment.keycloakConfig.clave
};



function initializeOAuth(oauthService: OAuthService): Promise<void> {
  return new Promise((resolve) => {
    oauthService.configure(authCodeFlowConfig);
    oauthService.setupAutomaticSilentRefresh();
    oauthService.loadDiscoveryDocumentAndLogin()
      .then(() => resolve());
  });
}



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    homeComponent,
    CiudadComponent,
    CiudadCreateComponent,
    TitleButtonComponent,
    ContentHeaderComponent,
    CreateMasivoComponent,
    DeleteMasivoComponent,
    ImageDecodeComponent,
    PersonaCreateTemplateComponent,
    PersonaCreateComponent,
    PersonaComponent,
    ClienteComponent,
    ClienteCreateComponent,
    ThousandsSeparatorPipe,
    LegajoComponent,
    LegajoCreateComponent,
    AsesorComponent,
    AsesorCreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: es_ES },
    provideHttpClient(),
    provideOAuthClient(),
    provideAnimations(),
    DecimalPipe,
    {
      provide: APP_INITIALIZER,
      useFactory: (oauthService: OAuthService) => {
        return () => {
          initializeOAuth(oauthService);
        }
      },
      multi: true,
      deps: [
        OAuthService,
        AuthService
      ]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
