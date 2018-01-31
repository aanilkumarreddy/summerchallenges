import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth/auth.service";
import { AngularFire } from "angularfire2";
import { AtletaService } from "../atleta/atleta.service";
import { CategoriasService } from "../categorias/categorias.service";
import { AtletasService } from "../atletas/atletas.service";
import { WodsService } from "./wods.service";
import { AuthCorreo } from "../auth/auth";
import { Atleta } from "../atleta/atleta";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-wods',
  templateUrl: './wods.component.html',
  styleUrls: ['./wods.component.css']
})
export class WodsComponent implements OnInit {

  private auth: any;
  public key: any;
  public atleta: any;
  public categoria: any;
  public wods: any;
  private atletas;
  private categorias;

  constructor(private authService: AuthService,
    private af: AngularFire,
    private atletaService: AtletaService,
    private router: Router,
    private route: ActivatedRoute,
    private categoriasService: CategoriasService,
    private atletasService: AtletasService,
    private wodsService: WodsService) {

    // this.atleta = this.atletasService.atleta;
    // console.log(this.atleta)
    // this.key = this.atleta.$key;
    // this.categoria = this.atleta.id_categoria;
    // this.getWods(this.categoria);
    // this.router.navigate(['public-wods']); 
    this.af.auth.subscribe((data: any) => {
      if (data) {
        this.auth = data.auth;
        let aux_atleta = this.atletasService.getAtleta_byEmail(this.auth.email);
        aux_atleta.subscribe(data => {
          data.forEach(element => {
            const atleta_actual = this.atletasService.getAtleta_byKey(element.$key);
            atleta_actual.subscribe(data => {
              console.log(data);
              // this.getTeam(data);
              this.atleta = data;
              this.key = data.$key;
              if (data.email == "info@summerchallenges.com") {
                this.router.navigate(['/admin']);
              }
              const categoria_actual = this.categoriasService.getCategoria(data.id_categoria);
              categoria_actual.subscribe(c_data => {
                c_data.forEach(element => {
                  this.categoria = element.nombre;
                  this.getWods(this.categoria);
                })
              })

            })
          });
        })


      } else {
        this.auth = null;
        this.atleta = null;
        this.router.navigate(['/login']);
      }

    })

  }

  ngOnInit() {
  }
  /*getPosition(){
  
    this.atletasService.atletas.subscribe(data =>{

      const atletas_wod1 = data.filter(element => element.wod_1);
      atletas_wod1.sort((a, b) => a.wod_1.puntuacion < b.wod_1.puntuacion ? 1 : -1);

      atletas_wod1.forEach(atleta =>{
        let aux = atletas_wod1.findIndex(at => at.nombre==atleta.nombre)+1;
        let aux_wod = {puntuacion: atleta.wod_1.puntuacion || 0, tiempo: atleta.wod_1.tiempo || 0, url: atleta.wod_1.url || "", puesto: aux};
        this.wodsService.update_wod1(atleta.$key, aux_wod);
        console.log(atleta.nombre + " - " + atleta.wod_1.puntuacion + " - PUNTOS:" + aux);
      })


      //console.log(atletas_wod1.findIndex(x => x.nombre=="ADMIN")+1);
      //console.table(atletas_wod1);
    })
    
  }*/

  getWods(categoria) {
    console.log(categoria);  
    let aux_wods = this.wodsService.wods;
    console.log(aux_wods);
    /* FILTRAMOS LOS WODS DE LA CATEGORIA TEEN*/
    if (this.atleta.id_categoria == 7) {
      this.wods = aux_wods.filter(wod => wod.teen == 1);
    } else {
      this.wods = aux_wods.filter(wod => wod.teen == 0);
    }

  }

  // update_wod1(puntuacion, tiempo, url, categoria) {
  //   if (puntuacion == "" || tiempo == "" || url == "") {
  //     return
  //   } else {
  //     /*let aux_atletas = this.atletas.filter(atleta => atleta.id_categoria == categoria && atleta.inscripcion.estado > 1);*/
  //     let wod = { puntuacion: puntuacion.value, tiempo: tiempo.value, url: url.value, puesto: "" };
  //     this.wodsService.update_wod1(this.key, wod);
  //     this.router.navigate(['/']);

  //     /*this.update_category(this.atletas.filter(atleta => atleta.id_categoria == categoria && atleta.inscripcion.estado > 1));*/
  //   }
  // }

  // update_wod2(puntuacion, tiempo, url, categoria) {
  //   if (puntuacion == "" || tiempo == "" || url == "") {
  //     return
  //   } else {
  //     /*let aux_atletas = this.atletas.filter(atleta => atleta.id_categoria == categoria && atleta.inscripcion.estado > 1);*/
  //     let wod = { puntuacion: puntuacion.value, tiempo: tiempo.value, url: url.value, puesto: "" };
  //     this.wodsService.update_wod2(this.key, wod);
  //     this.router.navigate(['/']);

  //     /*this.update_category(this.atletas.filter(atleta => atleta.id_categoria == categoria && atleta.inscripcion.estado > 1));*/
  //   }
  // }

  /*update_category(atletas_by){
    this.wodsService.update_leaderboard_wod1(atletas_by);
    this.wodsService.update_leaderboard_wod2(atletas_by);
  }*/

  /*update_categories_wod1(){
    const aux_categories = this.categoriasService.categorias;
    aux_categories.subscribe(categorias =>{
      categorias.forEach(categoria => {
        let atl_by_category = this.atletas.filter(atleta => atleta.id_categoria == categoria.c_id && atleta.inscripcion.estado > 1);

        this.wodsService.update_leaderboard_wod1(atl_by_category);
      })
    })
  }*/

}
