import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from "@angular/router";
import { AuthService } from '../auth/auth.service';
import { AngularFire, FirebaseListObservable } from "angularfire2";
import { AuthCorreo } from "../auth/auth";
import { Atleta } from "../atleta/atleta";
import { AtletasService } from "../atletas/atletas.service";
import { CategoriasService } from "../categorias/categorias.service";
import { WodsService } from "../wods/wods.service";


@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  private auth : any;
  public key : any;
  public atleta : any;
  public categoria : any;
  public estado : boolean;
  public atletas : any;
  public id_categoria : number;
  public aux_categoria;

  constructor(private authService : AuthService,
               private af : AngularFire,
               private router : Router,
               private route: ActivatedRoute,
               private atletasService : AtletasService,
               private categoriasService : CategoriasService,
               private wodsService : WodsService) {
    this.af.auth.subscribe (data => {
      if(data) {
        this.auth = data.auth;
        let aux_atletas = this.atletasService.getAtleta_byEmail(this.auth.email);
        aux_atletas.subscribe((atleta:any) => {
          this.atleta = atleta[0];
          this.key = atleta.$key;
          this.categoria = this.atleta.id_categoria;

          this.atletasService.getAtletas().subscribe(atletas => {
            // this.atletas = atletas;
            // Aquí ya tendríamos todos los atletas, a falta de filtrarlos
            this.getAtletas_byCategoria(this.categoria);
          })
        })
      }else {
        // Código de redirección a login .
        // No hay datos en auth, no está logueado.
      }
    })
   }

  ngOnInit() {
  }

  getAtletas_byCategoria(id_categoria){
    console.log(id_categoria);
    let _atletas = this.atletasService.getAtletas_byCategoria(id_categoria);
    _atletas.subscribe(data => {
      this.atletas = data
        .filter(atleta => atleta.estado > 1 &&
                          atleta.id_categoria==id_categoria
                          //Aquí se pueden añadir más filtros
                );
    })
    //this.orderBy_total();
  }
  orderBy_wod2(){
    // Ordernar por wod_2
    this.atletas.forEach(atleta =>{
      atleta.wod_2.puntuacion = parseInt(atleta.wod_2.puntuacion);
    })

    this.atletas.sort((a, b) => a.wod_2.puntuacion < b.wod_2.puntuacion ? 1 : -1);

    let kk = 0;
    this.atletas.forEach(atleta =>{
      if(atleta.wod_2.puntuacion!=0){
        kk++;
        atleta.wod_2.puesto = kk;
      }else{
        atleta.wod_2.puesto = 99;
      }
    })
    this.atletas.sort((a, b) => a.wod_2.puesto > b.wod_2.puesto ? 1 : -1);

    this.atletas.forEach(atleta =>{
      if(atleta.wod_2.puesto == 99){
        atleta.wod_2.puesto = "-";
      }
    })
  }

  orderBy_wod1(){
    this.atletas.forEach(atleta =>{
      atleta.wod_1.puntuacion = parseInt(atleta.wod_1.puntuacion);
    })
    this.atletas.sort((a, b) => a.wod_1.puntuacion < b.wod_1.puntuacion ? 1 : -1);

    let kk = 0;
    this.atletas.forEach(atleta =>{
      if(atleta.wod_1.puntuacion!=0){
        kk++;
        atleta.wod_1.puesto = kk;
      }else{
        atleta.wod_1.puesto = 99;
      }
    })
    this.atletas.sort((a, b) => a.wod_1.puesto > b.wod_1.puesto ? 1 : -1);

    this.atletas.forEach(atleta =>{
      if(atleta.wod_1.puesto == 99){
        atleta.wod_1.puesto = "-";
      }
    })
  }

  orderBy_total(){

    this.orderBy_wod1();
    this.orderBy_wod2();

    this.atletas.forEach(atleta =>{
      if(atleta.wod_1.puntuacion != 0 && atleta.wod_2.puntuacion != 0){
        atleta.puntos = atleta.wod_1.puesto + atleta.wod_2.puesto;
      }else if(atleta.wod_1.puntuacion != 0 || atleta.wod_2.puntuacion != 0){
        atleta.puntos = 98;
      }else{
        atleta.puntos = 99;
      }
    })

    this.atletas.sort((a, b) => a.puntos > b.puntos ? 1 : -1);

    this.atletas.forEach(atleta =>{
      if(atleta.puntos == 99 || atleta.puntos == 98){
        atleta.puntos = "-";
      }
    })


  }

}
