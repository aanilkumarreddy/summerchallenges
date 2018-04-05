import { Injectable, Inject } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseRef } from "angularfire2";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class VoluntariosService {

  public voluntarios: FirebaseListObservable<any[]>;
  public aux_voluntarios: any;
  public voluntario: any;

  constructor(private af: AngularFire,
    private authService: AuthService) {
    this.voluntarios = af.database.list('/Voluntarios');
    this.voluntarios.subscribe(data => {
      this.aux_voluntarios = data;
    })

  }

  getVoluntario_byEmail(email: string) {
    const aux_voluntario = this.af.database.list('/Voluntarios', {
      query: {
        orderByChild: 'email',
        equalTo: email,
      }
    })
    return aux_voluntario;
  }
  getVoluntarios() {
    const voluntarios = this.af.database.list('/Voluntarios');
    return voluntarios.map(data => data);
  }

  getVoluntario_byKey(key) {
    const aux_voluntario = this.af.database.object('/Voluntarios/' + key);
    return aux_voluntario;
  }

  pushVoluntario(Voluntario) {
    return this.af.database.list('/Voluntarios').push(Voluntario);

  }
  updateName(key, name: string) {
    const aux_atlete = this.getVoluntario_byKey(key);
    aux_atlete.update({ nombre: name });
  }

  setVoluntarioActual(key) {
    const aux_voluntario = this.getVoluntario_byKey(key);
    aux_voluntario.subscribe(data => {
      this.voluntario = data;
    })
  }

}
