import { Injectable, Inject } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseRef } from "angularfire2";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class AtletasService {

  public atletas: FirebaseListObservable<any[]>;
  public aux_atletas: any;
  public bandera;
  public atleta: any;
  public team: any;


  constructor(private af: AngularFire,
    private authService: AuthService) {
    this.atletas = af.database.list('/Atletas');
    this.atletas.subscribe(data => {
      this.aux_atletas = data;
    })


  }

  getAtleta_byEmail(email: string) {
    const aux_atleta = this.af.database.list('/Atletas', {
      query: {
        orderByChild: 'email',
        equalTo: email,
      }
    })
    return aux_atleta;
  }
  getAtletas() {
    const _query = this.af.database.list('/Atletas');
    return _query.map(atletas => atletas);
  }

  getAtleta_byState(state: number) {

  }

  getTeam_atl_1(key) {
    const aux_atleta = this.af.database.object('/Atletas/' + key + '/atl_1');
    return aux_atleta;
  }
  getTeam_atl_2(key) {
    const aux_atleta = this.af.database.object('/Atletas/' + key + '/atl_2');
    return aux_atleta;
  }
  getTeam_atl_3(key) {
    const aux_atleta = this.af.database.object('/Atletas/' + key + '/atl_3');
    return aux_atleta;
  }

  getAtleta_byCoach(email: string) {
    const aux_atleta = this.af.database.list('/Atletas', {
      query: {
        orderByChild: 'coach',
        equalTo: email,
      }
    })
    return aux_atleta;
  }

  getAtletas_byCategoria(id_categoria: number) {
    const aux_atletas = this.af.database.list('/Atletas', {
      query: {
        orderByChild: 'id_categoria',
        equalTo: id_categoria,
      }
    })
    return aux_atletas;
  }

  getAtleta_byKey(key) {
    const aux_atleta = this.af.database.object('/Atletas/' + key);
    return aux_atleta;
  }

  pushAtleta(atleta) {
    return this.af.database.list('/Atletas').push(atleta);

  }
  updateName(key, name: string) {
    const aux_atlete = this.getAtleta_byKey(key);
    aux_atlete.update({ nombre: name });
  }
  updatePassword(key, password: string) {
    let aux_atleta = this.getAtleta_byKey(key);
    return aux_atleta.update({ password: password });
  }

  updateCategory(key, categoria) {
    const aux_atlete = this.getAtleta_byKey(key);
    aux_atlete.update({ id_categoria: categoria });
  }

  updateTeam_1(key, atl_1) {
    const aux_atleta = this.getAtleta_byKey(key);
    aux_atleta.update({ atl_1: atl_1 });
  }
  updateTeam_2(key, atl_1) {
    const aux_atleta = this.getAtleta_byKey(key);
    aux_atleta.update({ atl_2: atl_1 });
  }
  updateTeam_3(key, atl_1) {
    const aux_atleta = this.getAtleta_byKey(key);
    aux_atleta.update({ atl_3: atl_1 });
  }
  updateWods(key, wods) {
    let atleta = this.getAtleta_byKey(key);

    return atleta.update({ wods: wods }).then(data => data);
  }
  updateEstado(key, estado) {
    let atleta = this.getAtleta_byKey(key);

    return atleta.update({ estado: estado }).then(data => data);
  }
  setAtletaActual(key) {
    const aux_atleta = this.getAtleta_byKey(key);
    aux_atleta.subscribe(data => {
      this.atleta = data;
    })
  }


}
