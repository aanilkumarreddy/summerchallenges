import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class RedSysAPIService {

  constructor(private http:Http) { }

  getData(id) {
    //ONLINE DEV
      //return this.http.get('http://api.gcsummerchallenge.com/random/' + id)
    //LOCAL DEV
      return this.http.get('http://localhost/GCSUMMAPI/payment/' + id)
    .map(response => response.json());
  }

  sendPayment() {
    /*
    console.log(this.payment);
    let form: any = document.querySelector('.login-form');
    form.html = 'Ds_Merchant_SignatureVersion <input type="text" name="Ds_SignatureVersion" value="' + this.payment.version + '" /><br /> Ds_Merchant_MerchantParameters<input type="text" name="Ds_MerchantParameters" value="' + this.payment.params + '"/><br /> Ds_Merchant_Signature<input type="text" name="Ds_Signature" value="' + this.payment.signature + '"/></br>';
    console.log(form.html);
    form.submit();
    */
  }

}
