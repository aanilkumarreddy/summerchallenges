import { Injectable } from "@angular/core";
import {
  AngularFire,
  FirebaseListObservable,
  FirebaseObjectObservable,
  FirebaseRef
} from "angularfire2";
import { AuthService } from "../auth/auth.service";
import { AtletasService } from "../atletas/atletas.service";

@Injectable()
export class WodsService {
  public wods: any;
  private allAtletes: any;

  constructor(
    private af: AngularFire,
    private authService: AuthService,
    private atletasService: AtletasService
  ) {
    

    this.atletasService.atletas.subscribe(atletas => {
      this.allAtletes = atletas;
    });
  }

  getWods(){
    let aux_wods = this.af.database.list("/Wods");
    return aux_wods;
  }

  initWods() {
    const wod_1_init = {
      kilos: 0,
      puesto: 99,
      puntuacion: 0,
      reps: 0,
      url: 'https://youtube.com'
    };
    const wod_2_init = {
      reps: 0,
      tiempo: "00:00",
      puesto: 99,
      puntuacion: 0,
      url: 'https://youtube.com'
    };
    this.atletasService.atletas.subscribe(atletas => {
      atletas.forEach(atleta => {
        if(!atleta.wod_1) {
          this.update_wod1(atleta.$key, wod_1_init);
          console.log(atleta);
        }
        if(!atleta.wod_2) {
          this.update_wod2(atleta.$key, wod_2_init);
          console.log(atleta);
        }
      })
    })
  }

  update_wod(wod) {
    const atl = this.atletasService.getAtleta_byKey(wod.key);
    console.log("servicio - wod update: ", wod);
    atl.update({ [wod.name]: wod.data });
  }

  update_wod1(key, wod) {
    const atl = this.atletasService.getAtleta_byKey(key);
    atl.update({ wod_1: wod });
  }

  update_wod2(key, wod) {
    const atl = this.atletasService.getAtleta_byKey(key);
    atl.update({ wod_2: wod });
  }
  update_puntos(key, pts) {
    const atl = this.atletasService.getAtleta_byKey(key);
    atl.update({ puntos: pts });
  }
  getLeaderboard_wod1(atletas) {
    const leaderboard = atletas.sort(
      (at_a, at_b) => (at_a.wod_1.puntuacion < at_b.wod_1.puntuacion ? 1 : -1)
    );
    return leaderboard;
  }

  update_leaderboard_wod1(leaderboard) {
    leaderboard = leaderboard.sort(
      (a, b) => (a.wod_1.puntuacion < b.wod_1.puntuacion ? 1 : -1)
    );

    leaderboard.forEach(atleta => {
      let pos = leaderboard.findIndex(at => at.email == atleta.email) + 1;
      let aux_wod = {
        puntuacion: atleta.wod_1.puntuacion || 0,
        tiempo: atleta.wod_1.tiempo || 0,
        url: atleta.wod_1.url || "",
        puesto: pos
      };
      this.update_wod1(atleta.$key, aux_wod);
      var pts = 0;
      if (atleta.wod_1.puntuacion == 0 && atleta.wod_2.puntuacion == 0) {
        var pts = 0;
      } else {
        pts = atleta.wod_1.puesto + atleta.wod_2.puesto;
      }

      this.update_puntos(atleta.$key, pts);
    });
  }

  update_leaderboard_wod2(leaderboard) {
    leaderboard = leaderboard.sort(
      (a, b) => (a.wod_2.puntuacion < b.wod_2.puntuacion ? 1 : -1)
    );

    leaderboard.forEach(atleta => {
      let pos = leaderboard.findIndex(at => at.email == atleta.email) + 1;
      let aux_wod = {
        puntuacion: atleta.wod_2.puntuacion || 0,
        tiempo: atleta.wod_2.tiempo || 0,
        url: atleta.wod_2.url || "",
        puesto: pos
      };
      this.update_wod2(atleta.$key, aux_wod);
      var pts = 0;
      if (atleta.wod_1.puntuacion == 0 && atleta.wod_2.puntuacion == 0) {
        var pts = 0;
      } else {
        pts = atleta.wod_1.puesto + atleta.wod_2.puesto;
      }
    });
  }

  getPosition(atleta, leaderboard) {
    return leaderboard.findIndex(at => at.email == atleta.email) + 1;
  }
}
