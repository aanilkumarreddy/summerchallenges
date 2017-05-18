import { Component, OnInit } from '@angular/core';
import { AtletasService } from "../atletas/atletas.service";
import { CategoriasService } from "../categorias/categorias.service";
import { WodsService } from "../wods/wods.service";

@Component({
  selector: 'app-public-leaderboard',
  templateUrl: './public-leaderboard.component.html',
  styleUrls: ['./public-leaderboard.component.css']
})
export class PublicLeaderboardComponent implements OnInit {

  private atletas : any;
  private categorias : any;
  public leaderboard : any;

  constructor(private atletasService : AtletasService,
              private categoriasService : CategoriasService,
              ) { 
                this.atletasService.atletas.subscribe(atletas =>{
                  this.setAtletas(atletas.filter( atleta => atleta.inscripcion.estado > 1));
                });

                this.categoriasService.categorias.subscribe(categorias =>{
                  this.setCategorias(categorias);
                })
              }

  ngOnInit() {
  }

  setAtletas(atletas){
    this.atletas = atletas;
    this.getLeaderboard(1, atletas);    
  }

  setCategorias(categorias){
    this.categorias = categorias;
  }

  getLeaderboard(categoria, atletas){
    this.leaderboard = atletas
                    .filter(atleta => atleta.id_categoria==categoria)
                    .sort((at_a, at_b) => at_a.puntos > at_b.puntos ? 1 : -1);
    console.log(this.leaderboard);
  }

}
