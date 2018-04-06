import { Component, OnInit } from '@angular/core';
import { AtletasService } from "../atletas/atletas.service";
import { Router } from "@angular/router";
import { WodsService } from "../wods/wods.service";
import { CategoriasService } from '../categorias/categorias.service';

@Component({
  selector: 'app-admin-leaderboard',
  templateUrl: './admin-leaderboard.component.html',
  styleUrls: ['./admin-leaderboard.component.css']
})
export class AdminLeaderboardComponent implements OnInit {

  public atletas: any;
  public teens: any;
  public query: string = "";
  public atletasFiltered: Array<any>;
  public categorias: Array<any>;
  public WOD: any;
  public WODS: any;
  public aux_WODS: any;
  public categoria: any = "todos";

  constructor(private atletasService: AtletasService,
    private router: Router,
    private wodsService: WodsService,
    private categoriasService: CategoriasService) {

    this.atletasService.getAtletas()
      .subscribe(data => {
        this.atletas = data.filter(atleta => atleta.estado > 4 || atleta.id_categoria == 6);
        this.atletasFiltered = this.atletas;
        this.search();
      })

    this.categoriasService.getCategorias()
      .subscribe(data => {
        this.categorias = data;
      })
    this.aux_WODS = {
      totalScore: 1,
      totalRanking: 0,
      wodsArray: []
    }
    this.WODS = {
      totalScore: 0,
      totalRanking: 0,
      wodsArray: []
    }
    this.WOD = {
      // "asc" ó "desc"
      type: "type",
      name: "name",
      score: 0,
      ranking: 0,
      dataScore: {
        reps: 0,
        kilos: 0,
        time: 0,
        maxTime: 0
      }
    }
  }

  ngOnInit() {
  }


  calculateWods() {
    let rx = {
      model: [{
        type: "asc",
        name: "WOD 1",
        cap: 600
      }, {
        type: "desc",
        name: "WOD 2",
        cap: 0
      }, {
        type: "asc",
        name: "WOD 3",
        cap: 600
      }]
    };

    this.atletas.forEach((atleta, index) => {
      /* if (atleta.id_categoria == 6) {
        let model = rx.model;
        this.WODS.wodsArray = [];

        model.forEach(w => {
          let wod = Object.assign({}, this.WOD);
          wod.type = w.type;
          wod.name = w.name;
          wod.dataScore.maxTime = w.cap;

          this.WODS.wodsArray.push(wod);

        })
        this.atletasService.updateWods(atleta.$key, this.WODS)
          .then(response => {
            console.log(response);
          })
        console.log(this.WODS);
      }*/
    })


    let team = {
      wods: this.WODS,
      cuantos: 6
    };
    let teens = {
      wods: this.WODS,
      cuantos: 5
    };
    let amateurs = {
      wods: this.WODS,
      cuantos: 3
    };
  }

  select(atleta) {
    console.log(atleta);
    this.calculateWods()
  }

  search() {
    let toSearch = this.atletas;

    this.atletasFiltered = toSearch.filter(atleta => {
      if (atleta.nombre.toLowerCase().indexOf(this.query) >= 0) return true;
      return false;
    });
    if (this.categoria != "todos") {
      this.atletasFiltered = this.atletasFiltered.filter(atleta => atleta.id_categoria == this.categoria)
    }
    console.log(this.atletasFiltered);
  }

  filter(id) {
    this.categoria = id;
    this.search();
  }

  getAtletas_byCategoria(id) {
    return this.atletas.filter(atleta => atleta.id_categoria == id);
  }


}
