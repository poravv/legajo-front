import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { homeComponent } from './admin/pages/home/home.component';
import { CiudadComponent } from './admin/pages/referenciales/ciudad/ciudad.component';
import { CiudadCreateComponent } from './admin/pages/referenciales/ciudad/ciudad-create/ciudad-create.component';
import { CreateMasivoComponent } from './admin/pages/create-masivo/create-masivo.component';
import { DeleteMasivoComponent } from './admin/pages/delete-masivo/delete-masivo.component';
import { RoleGuard } from './admin/services/auth/role.guard';
import { PersonaComponent } from './admin/pages/referenciales/persona/persona.component';
import { PersonaCreateComponent } from './admin/pages/referenciales/persona/persona-create/persona-create.component';
import { LegajoComponent } from './admin/pages/referenciales/legajo/legajo.component';
import { LegajoCreateComponent } from './admin/pages/referenciales/legajo/legajo-create/legajo-create.component';
import { AsesorComponent } from './admin/pages/referenciales/asesor/asesor.component';
import { AsesorCreateComponent } from './admin/pages/referenciales/asesor/asesor-create/asesor-create.component';
import { NotificationsComponent } from './admin/pages/notifications/notifications.component';
import { PersonaGesDayComponent } from './admin/pages/referenciales/persona/gesday/personagesday.component';

const routes: Routes = [
  { path: '', component: homeComponent },
  { path: 'create-masivo/:type', component: CreateMasivoComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin', 'asesor'] } },
  { path: 'delete-masivo/:type', component: DeleteMasivoComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin', 'asesor'] } },
  {
    path: 'ciudad',
    children: [
      { path: 'list', component: CiudadComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin', 'asesor'] } },
      { path: 'create', component: CiudadCreateComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin', 'asesor'] } }
    ]
  },
  {
    path: 'asesor',
    children: [
      { path: 'list', component: AsesorComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin', 'asesor'] } },
      { path: 'create', component: AsesorCreateComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin', 'asesor'] } }
    ]
  },
  {
    path: 'cliente',
    children: [
      { path: 'list', component: PersonaComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin','asesor'] } },
      { path: 'create', component: PersonaCreateComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin','asesor'] } },
      { path: 'edit/:idcliente', component: PersonaCreateComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin','asesor'] } },
    ]
  }, 
  {
    path: 'gesday',
    children: [
      { path: 'list', component: PersonaGesDayComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin','asesor'] } },
      { path: 'create', component: PersonaCreateComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin','asesor'] } },
      { path: 'edit/:idcliente', component: PersonaCreateComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin','asesor'] } },
    ]
  }, 
  {
    path: 'legajo',
    children: [
      { path: 'list', component: LegajoComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin','asesor'] } },
      { path: 'create/:idpersona', component: LegajoCreateComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin','asesor'] } },
      { path: 'edit/:idpersona', component: LegajoCreateComponent, canActivate: [RoleGuard], data: { expectedRoles: ['admin','asesor'] } },
    ]
  },
  { path: 'notifications', component: NotificationsComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
