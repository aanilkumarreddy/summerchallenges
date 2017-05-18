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
  public atleta : Atleta;
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
  //Nos subscribimos y cargamos los datos de auth para obtener el atleta actual
    this.af.auth.subscribe( (data : any) => {
      if(data){
        this.auth = data.auth;
        let aux_atleta = this.atletasService.getAtleta_byEmail(this.auth.email);
        aux_atleta.subscribe(data => {
          data.forEach(element => {
            const atleta_actual = this.atletasService.getAtleta_byKey(element.$key);
            atleta_actual.subscribe(data => {
              this.atleta = data;
              this.key = data.$key;
              console.log(data.$key);
  
              const categoria_actual = this.categoriasService.getCategoria(data.id_categoria);
              categoria_actual.subscribe(data => {
                data.forEach(element => {
                  this.categoria = element.nombre;
                  this.id_categoria = element.c_id;
                  this.getAtletas_byCategoria(element.c_id);
                })
              })
            })
          });
        })

      }else{
        this.auth = null;
        this.atleta = null;
        this.router.navigate(['/login']);
      }

    })

   }   

  ngOnInit() {
  }

  getAtletas_byCategoria(id_categoria){
    const cat = this.categoriasService.getCategoria(id_categoria);
    cat.subscribe(data => {
      data.forEach(categoria => {
        this.aux_categoria = categoria.nombre;
      })
    })
    const aux_atletas = this.atletasService.getAtletas_byCategoria(id_categoria);
    aux_atletas.subscribe(data => {
      this.atletas = data.filter(atleta => atleta.inscripcion.estado>1);
      this.wodsService.update_leaderboard_wod1(this.atletas);
      this.wodsService.update_leaderboard_wod2(this.atletas);
    })
  }

}
