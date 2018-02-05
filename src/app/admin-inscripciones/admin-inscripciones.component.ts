import { Component, OnInit } from '@angular/core';
import { InscripcionService } from "../inscripcion/inscripcion.service";
import { AtletasService } from "../atletas/atletas.service";
import { AdminAtleta } from "./admin-atleta";
import { AngularFire } from "angularfire2";
import { Router } from "@angular/router";
import { WodsService } from "../wods/wods.service";

@Component({
  selector: 'app-admin-inscripciones',
  templateUrl: './admin-inscripciones.component.html',
  styleUrls: ['./admin-inscripciones.component.css']
})
export class AdminInscripcionesComponent implements OnInit {

  private atletas;
  private atletas_nopagado;
  private atletas_pagado;
  private auth : any;

  public lista_actual:Array<any>;
  public lista_actual_no:Array<any>;
  public lista_actual_si:Array<any>;

  public num_inscripciones : number;
  public num_pagados : number;
  public num_rx : number;
  public num_scm : number;
  public num_scf : number;
  public num_tm : number;
  public num_msm : number;
  public num_msf : number;
  public num_tn : number;

  constructor(private atletasService : AtletasService,
              private af : AngularFire,
              private router : Router,
              private wodsService : WodsService) {

  this.atletas = this.atletasService.atletas;
  this.getAtletas();
  this.af.auth.subscribe( (data : any) => {
    if(data){
      this.auth = data.auth;
      let aux_atleta = this.atletasService.getAtleta_byEmail(this.auth.email);
      aux_atleta.subscribe(data => {
        data.forEach(element => {
          const atleta_actual = this.atletasService.getAtleta_byKey(element.$key);
          atleta_actual.subscribe(data => {

            if(data.email != "info@gcsummerchallenge.com"){
              this.router.navigate(['/login']);
            }
            })
          })
        });
      }
    })

  }

  ngOnInit() {
  }

  getAtletas(){
    this.atletas.subscribe(atletas =>{
      this.lista_actual = atletas;
      this.num_inscripciones = this.lista_actual.length;
      this.lista_actual_no = this.lista_actual.filter(atleta => atleta.estado === 1);
      this.lista_actual_si = this.lista_actual.filter(atleta => atleta.estado === 2);
      this.num_pagados = this.lista_actual_si.length;

      /* INTENTAR MEJORAR ESTA PARTE DEL CÓDIGO, QUE REALICE UN FOREACH EN LAS CATEGORIAS Y SAQUE LOS DATOS EN UNA SOLA LÍNEA*/
      this.num_rx = this.getNumAthletes_byCategory_estatus(this.lista_actual, 1, 2);
      this.num_scm = this.getNumAthletes_byCategory_estatus(this.lista_actual, 2, 2);
      this.num_scf = this.getNumAthletes_byCategory_estatus(this.lista_actual, 3, 2);
      this.num_tm = this.getNumAthletes_byCategory_estatus(this.lista_actual, 4, 2);
      this.num_msm = this.getNumAthletes_byCategory_estatus(this.lista_actual, 5, 2);
      this.num_msf = this.getNumAthletes_byCategory_estatus(this.lista_actual, 6, 2);
      this.num_tn = this.getNumAthletes_byCategory_estatus(this.lista_actual, 7, 2);
      /* HASTA AQUÍ */

    })
  }

  getNumAthletes_byCategory_estatus(lista, c, e){
    return lista.filter(a => a.id_categoria === c && a.estado === e).length;
  }
  getNumAthletes_byCategory(lista, c){
    return lista.filter(a => a.id_categoria === c).length;
  }

  getAtletasNoPagado(){
    this.atletas
  }

  activar(key, fecha, pedido){
    let inscripcion = {estado : 2, fecha : fecha, id_pedido : pedido};
    const atl = this.atletasService.getAtleta_byKey(key);
    atl.update({ inscripcion : inscripcion });
    let wod = {puntuacion : 0, tiempo : 0, url : 0, puesto : ""};
    this.wodsService.update_wod1(key, wod);
    this.wodsService.update_wod2(key, wod);
    this.wodsService.update_puntos(key, 0);
  }

  desactivar(key, fecha, pedido){
    let inscripcion = {estado : 1, fecha : fecha, id_pedido : pedido};
    const atl = this.atletasService.getAtleta_byKey(key);
    atl.update({ inscripcion : inscripcion });
  }

}
