import { Injectable } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods } from "angularfire2";
import * as fire from 'firebase';
import { Response } from '@angular/http/src/static_response';


@Injectable()
export class AuthService {

  constructor(
    private af: AngularFire,
  ) {

  }


  createUser(email: string, password: string) {
    return this.af.auth.createUser({ email: email, password: password })
  }

  login_google() {
    return this.af.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup
    })
  }

  login_correo(atletaCorreo: string, atletaPass: string) {
    return this.af.auth.login({
      email: atletaCorreo,
      password: atletaPass,
    },
      {
        provider: AuthProviders.Password,
        method: AuthMethods.Password,
      });
  }

  logout() {
    return this.af.auth.logout()
      .then(response => {})
  }

  // resetPassword(email) {
  //   // let aux_atleta:any = this.atletasService.getAtleta_byEmail(email);
  //   // this.emailService.send('registro', aux_atleta.key)
  //   //   .subscribe(data => {
  //   //     console.log(data);
  //   //   })
  // }

}
