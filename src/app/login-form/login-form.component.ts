import { Component } from '@angular/core';
import { UserLogin } from './user-login';
import { NgForm } from '@angular/forms';
import { Http } from '@angular/http';
import { RedSysAPIService } from '../redSysAPI/red-sys-api.service';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  private payment : any;

  constructor(private http:Http, private redsys:RedSysAPIService) {
    let data = this.redsys.getData()
      .subscribe(data => {
        this.payment = data;
      })
  }
  user = new UserLogin('', '');

  submitted = false;

  onSubmit() {
    this.submitted = true;
  }

  //TODO: Eliminar cuando esté todo listo
  get diagnostic() {return JSON.stringify(this.user);}
}
