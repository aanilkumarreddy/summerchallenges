import { Component, OnInit } from '@angular/core';
import { AtletasService } from "../atletas/atletas.service";
import { Router } from "@angular/router";
import { WodsService } from "../wods/wods.service";
import { CategoriasService } from '../categorias/categorias.service';
import { OrdenarPuestosService } from '../ordenar-puestos.service';

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
    private categoriasService: CategoriasService,
    private ordenarPuestos: OrdenarPuestosService) {

    this.atletasService.getAtletas()
      .subscribe(data => {
        this.atletas = data.filter(atleta => atleta.estado > 4);
        this.atletasFiltered = this.atletas;
        this.search();
        //this.calculateWods();
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
        name: "WOD 2.A",
        cap: 0
      }, {
        type: "desc",
        name: "WOD 2.B",
        cap: 0
      }, {
        type: "desc",
        name: "WOD 3",
        cap: 0
      }, {
        type: "asc",
        name: "WOD 4",
        cap: 900
      }, {
        type: "desc",
        name: "WOD 5",
        cap: 0
      }, {
        type: "asc",
        name: "FINAL",
        cap: 900
      }]
    };

    this.atletas.forEach((atleta, index) => {

      if (atleta.id_categoria == 1) {
        let model = rx.model;
        this.WODS.wodsArray = [];

        model.forEach(w => {
          let wod = Object.assign({}, this.WOD);
          wod.type = w.type;
          wod.name = w.name;
          console.log(w.cap);
          let aux_dataScore = {
            reps: 0,
            kilos: 0,
            time: 0,
            maxTime: w.cap
          };
          wod.dataScore = aux_dataScore;
          this.WODS.wodsArray.push(wod);
          console.log(this.WODS);

        })
        console.log(this.WODS);
        this.atletasService.updateWods(atleta.$key, this.WODS)
          .then(response => {
            console.log(response);
          })
        console.log(this.WODS);
      }
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

  toMinutes(time) {
    let minutes = time / 60;
    let seconds = time % 60;

    return minutes + ":" + seconds + "0";
  }

  select(atleta) {
    console.log(atleta);
    //this.calculateWods()
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
    this.atletasFiltered.forEach(atleta => {
      if (atleta.id_categoria == 6 && atleta.estado == 2) {
        this.atletasService.updateEstado(atleta.$key, 5).then(data => { console.log(data, atleta) });
      }
    })

  }

  filter(id) {
    this.categoria = id;
    this.search();
  }

  getAtletas_byCategoria(id) {
    return this.atletas.filter(atleta => atleta.id_categoria == id);
  }

  actualizar(atleta, wod) {
    if (wod.type == "asc") {
      let time;
      let minutes;
      let seconds;
      let final_time;
      if (wod.dataScore.time != wod.dataScore.maxTime) {
        time = wod.dataScore.time.split(":");
        minutes = time[0] * 60;
        seconds = time[1];
        final_time = minutes + parseFloat(seconds);
        console.log(wod.dataScore.time);
      }
      console.log(final_time, wod.dataScore.time);

      if (final_time == wod.dataScore.maxTime || wod.dataScore.time == wod.dataScore.maxTime) {
        wod.dataScore.time = final_time || wod.dataScore.time;

        atleta.wods.wodsArray.forEach(_wod => {
          console.log(_wod);
          if (_wod.name == wod.name) {
            console.log(wod.score, wod.dataScore.time);
            _wod.score = wod.score;
            _wod.dataScore.time = wod.dataScore.time;
            if (final_time) {
              wod.score = final_time;
            }
          }
        })
      } else {
        console.log(final_time, wod.score);
        atleta.wods.wodsArray.forEach(_wod => {
          if (_wod.name == wod.name) {
            _wod.score = wod.dataScore.time
            _wod.dataScore.time = final_time;
          }
        })
      }
      console.log(wod);
      /* wod.dataScore.time = final_time || wod.dataScore.time; */

    }
    atleta.wods.wodsArray.forEach(a_wod => {
      if (a_wod.name == wod.name) {
        a_wod = wod.name;
      }
    })

    console.log(atleta.wods);

    atleta.wods.wodsArray.forEach(wod => {
      if (wod.type == "desc" || (wod.type == "asc" && wod.dataScore.time == wod.dataScore.maxTime)) {
        wod.score = parseFloat(wod.score);
        console.log(wod.score);
      }
    })

    this.atletasService.updateWods(atleta.$key, atleta.wods);

    this.ordenarPuestos.getWodOrdenado(atleta.id_categoria, wod.name)
      .subscribe(data => {
        data.forEach(_atleta => {
          if (_atleta.$key == atleta.$key) {
            atleta.wods = _atleta.wods;
            console.log(atleta);
            this.atletasService.updateWods(atleta.$key, atleta.wods);
          }
        })
      });

    this.ordenarPuestos.getClasificacionFinal(atleta.id_categoria)
      .subscribe(data => { console.log(data) });
  }

}

