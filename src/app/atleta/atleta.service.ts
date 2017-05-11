import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from "angularfire2";
import { Atleta } from "./atleta";
import { AuthGoogle } from "../auth/auth";

@Injectable()
export class AtletaService {

  constructor(private af : AngularFire) { }

  getAtleta() : FirebaseListObservable<any> {
    return this.af.database.list('Atletas')
  }

  sendAtleta(usuario : AuthGoogle, a_b, a_c){
    //let newAtleta = new Atleta(usuario.name, a_b, usuario.email, a_c);
    //this.af.database.list('/Atletas').push(newAtleta);
  }

}
