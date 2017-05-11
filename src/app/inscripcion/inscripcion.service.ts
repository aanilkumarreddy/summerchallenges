import { Injectable, Inject } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable, FirebaseRef } from "angularfire2";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class InscripcionService {

  public inscripciones : FirebaseListObservable <any[]>;

  constructor(private af : AngularFire) {
    this.inscripciones = af.database.list('/Inscripciones');
   }

   getInscripcion_byEmail(email : string){
     const aux_inscripcion = this.af.database.list('/Inscripciones', {
       query : {
         orderByChild : 'id_atleta',
         equalTo : email,
       }
     })
     return aux_inscripcion;
   }

   pushInscripcion(inscripcion){
    this.af.database.list('/Inscripciones').push(inscripcion);
   }

}
