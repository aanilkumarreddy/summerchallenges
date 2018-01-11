import { Component, OnInit } from '@angular/core';
import { AtletasService } from "../atletas/atletas.service";
import { Router } from "@angular/router";
import { WodsService } from "../wods/wods.service";

@Component({
  selector: 'app-admin-leaderboard',
  templateUrl: './admin-leaderboard.component.html',
  styleUrls: ['./admin-leaderboard.component.css']
})
export class AdminLeaderboardComponent implements OnInit {

  public atletas : any;
  public teens : any;

  constructor(private atletasService : AtletasService,
              private router : Router,
              private wodsService : WodsService) {
    this.atletas = this.atletasService.aux_atletas;
    if(!this.atletas){
      this.router.navigate(['/login']);
    }else{
      this.getAtletas_byCategoria(1);
      this.teens = this.atletas.filter(atleta => atleta.inscripcion.estado == 2 && atleta.id_categoria == 7);
    } 
  }

  ngOnInit() {
  }
  getAtletas_byCategoria(id_categoria){
    this.atletas = this.atletasService.aux_atletas.filter(atleta => atleta.inscripcion.estado == 2 && atleta.id_categoria==id_categoria);    
    if(id_categoria!=7){
      this.orderBy_total(); 
    }else{
      this.orderBy_total_teens();
    }
  }
  
  orderBy_wod2(){
    // Ordernar por wod_2
    this.atletas.forEach(atleta =>{
      atleta.wod_2.puntuacion = parseFloat(atleta.wod_2.puntuacion);
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
  orderBy_wod2_teens(){
    // Ordernar por wod_2
    this.atletas.forEach(atleta =>{
      var aux_time = atleta.wod_2.puntuacion.split(":");
      aux_time = (parseInt(aux_time[0])*60) + parseInt(aux_time[1]);
      atleta.wod_2.puntuacion = aux_time;
    })
    
    this.atletas.sort((a, b) => a.wod_2.puntuacion > b.wod_2.puntuacion ? 1 : -1);
    
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
    this.atletas.forEach(atleta =>{
      let minutos = Math.floor(atleta.wod_2.puntuacion/60);
      let segundos = atleta.wod_2.puntuacion % 60;
      atleta.wod_2.puntuacion = minutos+":"+segundos;      
    }) 
  }

  orderBy_wod1(){
    this.atletas.forEach(atleta =>{
      atleta.wod_1.puntuacion = parseFloat(atleta.wod_1.puntuacion);
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
  orderBy_wod1_teens(){
    this.atletas.forEach(atleta =>{
      var aux_time = atleta.wod_1.puntuacion.split(":");
      aux_time = (parseInt(aux_time[0])*60) + parseInt(aux_time[1]);
      atleta.wod_1.puntuacion = aux_time;
    })
     
    this.atletas.sort((a, b) => a.wod_1.puntuacion > b.wod_1.puntuacion ? 1 : -1);

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
    this.atletas.forEach(atleta =>{
      let minutos = Math.floor(atleta.wod_1.puntuacion/60);
      let segundos = atleta.wod_1.puntuacion % 60;
      atleta.wod_1.puntuacion = minutos+":"+segundos;      
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
    let flag = 0;
    let emails = "";
    this.atletas.forEach(atleta =>{
      flag++;
      if(flag<=16){
        emails += atleta.nombre+": "+atleta.email+ ", ";
      }
      
      
    })
    console.log(emails);    
  }
  orderBy_total_teens(){

    this.orderBy_wod1_teens();
    this.orderBy_wod2_teens();
    
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

  mejorarWod(n_wod, atleta){
    if(n_wod == 1){
      let puntuacion = atleta.wod_1.puntuacion + 0.1;
      let wod = {
        puntuacion : puntuacion,
        tiempo : atleta.wod_1.tiempo,
        url : atleta.wod_1.url,
        puesto : ""
      };
      this.wodsService.update_wod1(atleta.$key, wod);
      this.getAtletas_byCategoria(atleta.id_categoria);
    }
    if(n_wod == 2){
      let puntuacion = atleta.wod_2.puntuacion + 0.1;
      let wod = {
        puntuacion : puntuacion,
        tiempo : atleta.wod_2.tiempo,
        url : atleta.wod_2.url,
        puesto : ""
      };
      this.wodsService.update_wod2(atleta.$key, wod);
      this.getAtletas_byCategoria(atleta.id_categoria);
    }
  }


}
