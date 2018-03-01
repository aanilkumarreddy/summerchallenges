import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { AngularFireModule } from 'angularfire2';
import 'hammerjs';
import { ResultadoComponent } from './resultado/resultado.component';
import { AtletasComponent } from './atletas/atletas.component';
import { AtletaComponent } from './atleta/atleta.component';
import { InscripcionComponent } from './inscripcion/inscripcion.component';
import { AtletaService } from "./atleta/atleta.service";
import { AtletasService } from "./atletas/atletas.service";
import { JuecesService } from "./jueces/jueces.service";
import { VoluntariosService } from "./voluntarios/voluntarios.service";
import { CategoriasComponent } from './categorias/categorias.component';
import { CategoriasService } from "./categorias/categorias.service";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormRedsysComponent } from './form-redsys/form-redsys.component';
import { InscripcionService } from "./inscripcion/inscripcion.service";
import { EditComponent } from './edit/edit.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { AdminInscripcionesComponent } from './admin-inscripciones/admin-inscripciones.component';
import { WodsComponent } from './wods/wods.component';
import { WodsService } from './wods/wods.service';
import { PublicLeaderboardComponent } from './public-leaderboard/public-leaderboard.component';
import { PublicWodsComponent } from './public-wods/public-wods.component';
import { TeamScoresComponent } from './team-scores/team-scores.component';
import { AdminLeaderboardComponent } from './admin-leaderboard/admin-leaderboard.component';
import { CountdownComponent } from './countdown/countdown.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { RedSysAPIService } from './redSysAPI/red-sys-api.service';
import { RegistroTeamComponent } from './registro-team/registro-team.component';
import { RegistroJuezComponent } from './registro-juez/registro-juez.component';
import { RegistroVoluntarioComponent } from './registro-voluntario/registro-voluntario.component'
import { EmailService } from './email-service/email.service';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RegistroIndividualComponent } from './registro-individual/registro-individual.component';
import { WodCardComponent } from './wod-card/wod-card.component';
import { InstagramComponent } from './instagram/instagram.component';
import { InstagramService } from './instagram/instagram.service';
import { PublicPanelComponent } from './public-panel/public-panel.component';
import { RequisitosComponent } from './requisitos/requisitos.component';


// Must export the config
export const firebaseConfig = {
  apiKey: "AIzaSyDfWOWoqNiwXG2A275hpPGfxR7vKqeP5hw",
  authDomain: "lnzsumchl1.firebaseapp.com",
  databaseURL: "https://lnzsumchl1.firebaseio.com",
  projectId: "lnzsumchl1",
  storageBucket: "lnzsumchl1.appspot.com",
  messagingSenderId: "523835141115"
};

const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'registro-individual', component: RegistroIndividualComponent },
  { path: 'registro-team', component: RegistroTeamComponent },
  { path: 'registro-juez', component: RegistroJuezComponent },
  { path: 'registro-voluntario', component: RegistroVoluntarioComponent },
  { path: 'confirmacion', component: InscripcionComponent },
  { path: 'edit', component: EditComponent },
  // { path : 'wods', component : WodsComponent},
  { path: 'public-panel', redirectTo: '/inscritos', pathMatch: 'full' },
  { path: 'inscritos', component: PublicPanelComponent },
  { path: 'requisitos', component: RequisitosComponent },
  //{ path: 'countdown', component: LoginComponent},
  //{ path : 'public-wods', component : PublicWodsComponent},
  // { path : 'leaderboard', component: LeaderboardComponent},
  { path: 'instagram', component: InstagramComponent },
  // { path : 'public-leaderboard', component : PublicLeaderboardComponent},
  { path: 'admin', component: AdminInscripcionesComponent },
  // { path : 'admin-leaderboard', component : AdminLeaderboardComponent},
  //{ path : 'team-scores', component : TeamScoresComponent},
  //{ path : 'countdown', redirectTo : '/login', pathMatch: 'full'},
  { path: 'reset-password-login', component: LoginFormComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '', redirectTo: '/inscritos', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  declarations: [
    AppComponent,
    ResultadoComponent,
    AtletasComponent,
    AtletaComponent,
    InscripcionComponent,
    CategoriasComponent,
    LoginComponent,
    RegistroComponent,
    DashboardComponent,
    FormRedsysComponent,
    EditComponent,
    LeaderboardComponent,
    AdminInscripcionesComponent,
    WodsComponent,
    PublicLeaderboardComponent,
    PublicWodsComponent,
    TeamScoresComponent,
    AdminLeaderboardComponent,
    CountdownComponent,
    LoginFormComponent,
    RegistroTeamComponent,
    RegistroJuezComponent,
    RegistroVoluntarioComponent,
    ResetPasswordComponent,
    RegistroIndividualComponent,
    WodCardComponent,
    InstagramComponent,
    PublicPanelComponent,
    RequisitosComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot()
  ],
  providers: [
    AuthService,
    AtletaService,
    CategoriasService,
    AtletasService,
    JuecesService,
    VoluntariosService,
    InscripcionService,
    WodsService,
    RedSysAPIService,
    EmailService,
    InstagramService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
