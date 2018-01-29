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
import { AtletasService} from "./atletas/atletas.service";
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
import { RegistroTeamComponent } from './registro-team/registro-team.component'

// Must export the config
export const firebaseConfig = {
  apiKey: "AIzaSyDfWOWoqNiwXG2A275hpPGfxR7vKqeP5hw",
  authDomain: "lnzsumchl1.firebaseapp.com",
  databaseURL: "https://lnzsumchl1.firebaseio.com",
  projectId: "lnzsumchl1",
  storageBucket: "lnzsumchl1.appspot.com",
  messagingSenderId: "523835141115"
 };

const appRoutes : Routes = [
  { path : 'dashboard', component : DashboardComponent },
  { path : 'login', component : LoginComponent },
  { path : 'registro', component : RegistroComponent },
  { path : 'confirmacion', component : InscripcionComponent },
  { path : 'edit', component : EditComponent},
  { path : 'wods', component : WodsComponent},
  { path: 'countdown', component: CountdownComponent},
  { path : 'public-wods', component : PublicWodsComponent},
  { path : 'public-leaderboard', component : PublicLeaderboardComponent},
  { path : 'admin', component : AdminInscripcionesComponent},
  { path : 'admin-leaderboard', component : AdminLeaderboardComponent},
  { path : 'team-scores', component : TeamScoresComponent},
  { path : '', redirectTo : '/countdown', pathMatch : 'full'},
  { path : '**', redirectTo : '/countdown' }
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
    InscripcionService,
    WodsService,
    RedSysAPIService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
