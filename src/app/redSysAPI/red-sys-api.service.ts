import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class RedSysAPIService {

  constructor(private http:Http) { }

  getData(key) {
    /*
    * La API se encarga de generar la petición de pago con los datos del usuario
    * Por parámetro debe llegar el key del auth del usuario
    */
      return this.http.get('http://api.gcsummerchallenge.com/payment/' + key)
    .map(response => response.json());
  }
}
