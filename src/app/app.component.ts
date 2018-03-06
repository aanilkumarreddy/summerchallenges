import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { AngularFire, FirebaseListObservable } from "angularfire2";
import { AuthGoogle } from './auth/auth';
import { AtletaService } from "./atleta/atleta.service";
import { CategoriasService } from "./categorias/categorias.service";
import { AtletasService } from "./atletas/atletas.service";
import { RouterModule, Routes, Router } from '@angular/router';
import { WodsService } from "./wods/wods.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private auth : AuthGoogle;
  private listCategorias : FirebaseListObservable<any>;
  private listAtletas : FirebaseListObservable<any []>;
  public aux_atletas : any;
  public atleta : any;
  public key : any;
  public wods : any;

  constructor( private authService : AuthService,
               private af : AngularFire,
               private atletaService : AtletaService,
               private categoriasService : CategoriasService,
               private atletasService : AtletasService,
               public wodsService : WodsService,
               private router : Router) {
    //Nos subscribimos y cargamos los datos de auth
    this.af.auth.subscribe( (data : any) => {
      if(data){
        this.auth = data.auth;
        let aux_atleta = this.atletasService.getAtleta_byEmail(this.auth.email).subscribe(data => {
          data.forEach(element => {
            const atleta_actual = this.atletasService.getAtleta_byKey(element.$key);
            atleta_actual.subscribe(data => {
              this.atleta = data;
              this.key = data.$key;
              this.atletasService.setAtletaActual(this.key);
              this.categoriasService.setCategoriaActual(data.id_categoria);
              
            })
          });
        })

      }else{
        this.auth = null;
        this.atleta = null;
      }

      this.wods = this.wodsService.wods;

    })
  } // fin del constructor


  login_google() {
    this.authService.login_google();
    this.router.navigate(['/dashboard', this.auth.email]);
  }

  login_correo(atletaCorreo : string, atletaPass : string){
    this.authService.login_correo(atletaCorreo, atletaPass);
    this.router.navigate(['/dashboard', this.auth.email]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getAtleta(){

  }
  sendAtleta(datos : HTMLFormElement){
    console.log(this.auth);
  }

}