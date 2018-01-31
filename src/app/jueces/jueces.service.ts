import { Injectable, Inject } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseRef } from "angularfire2";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class JuecesService {

  public jueces: FirebaseListObservable<any[]>;
  public aux_jueces: any;
  public juez: any;

  constructor(private af: AngularFire,
    private authService: AuthService) {
    this.jueces = af.database.list('/Jueces');
    this.jueces.subscribe(data => {
      this.aux_jueces = data;
    })

  }

  getJuez_byEmail(email: string) {
    const aux_juez = this.af.database.list('/Jueces', {
      query: {
        orderByChild: 'email',
        equalTo: email,
      }
    })
    return aux_juez;
  }

  getJuez_byKey(key) {
    const aux_juez = this.af.database.object('/Jueces/' + key);
    return aux_juez;
  }

  pushJuez(juez) {
    return this.af.database.list('/Jueces').push(juez);
  }
  updateName(key, name: string) {
    const aux_atlete = this.getJuez_byKey(key);
    aux_atlete.update({ nombre: name });
  }

  setJuezActual(key) {
    const aux_juez = this.getJuez_byKey(key);
    aux_juez.subscribe(data => {
      this.juez = data;
    })
  }

}
