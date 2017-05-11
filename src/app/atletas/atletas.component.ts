import { Component, OnInit } from '@angular/core';
import { AuthGoogle } from "../auth/auth";
import { FirebaseListObservable, AngularFire } from "angularfire2";
import { AuthService } from "../auth/auth.service";
import { AtletaService } from "../atleta/atleta.service";
import { CategoriasService } from "../categorias/categorias.service";
import { AtletasService } from "./atletas.service";

@Component({
  selector: 'app-atletas',
  templateUrl: './atletas.component.html',
  styleUrls: ['./atletas.component.css']
})
export class AtletasComponent implements OnInit {

  private auth : AuthGoogle;
  private listCategorias : FirebaseListObservable<any>;
  private listAtletas : FirebaseListObservable<any []>;
  public aux_atletas : any;

  constructor(private authService : AuthService,
               private af : AngularFire,
               private atletaService : AtletaService,
               private categoriasService : CategoriasService,
               private atletasService : AtletasService) { 
    //Nos subscribimos y cargamos los datos de auth
    this.af.auth.subscribe( (data : any) => {
      if(data){
        this.auth = new AuthGoogle(data.auth.uid, data.auth.displayName, data.auth.email, data.auth.photoURL);
      }else{
        this.auth = null;
      }
    })
      
  }

  ngOnInit() {
    this.getAtletas();
  }
  
  // Obtiene el atleta a través del auth
  getAtletaActual(){
    console.log(this.auth.email);
    this.atletasService.getAtleta_byEmail(this.auth.email).subscribe(aux_atletas =>{
    this.aux_atletas = aux_atletas;
    })
  }

  //Obtiene todos los atletas registrados
  getAtletas(){
    this.listAtletas = this.atletasService.atletas;

    this.listAtletas.subscribe(aux_atletas => {
      this.aux_atletas = aux_atletas;
    })
  }

  //Obtiene un atleta en concreto a trvés de un email pasado como parámetro
  getAtletaByEmail(email : string) {
    this.atletasService.getAtleta_byEmail(email).subscribe(aux_atletas =>{
      this.aux_atletas = aux_atletas;
    }) 
  }

  //Obtiene todos los atletas de un coach específico, pasándo el email del coach como parámetro
  getAtletasByCoach(){
    this.atletasService.getAtleta_byCoach(this.auth.email).subscribe(aux_atletas =>{
        this.aux_atletas = aux_atletas;
    })
  }

}
