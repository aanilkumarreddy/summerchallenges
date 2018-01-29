import { Component } from '@angular/core';
import { UserLogin } from './user-login';
import { NgForm } from '@angular/forms';
import { Http } from '@angular/http';
import { RedSysAPIService } from '../redSysAPI/red-sys-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  private payment: any;

  /*poner private a todas ?¿? */
  rForm: FormGroup;
  post: any;
  email: string = '';
  password: string = '';

  emailPattern =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private http: Http, private redsys: RedSysAPIService, private fb: FormBuilder) {
    let data = this.redsys.getData('email@gmail.com')
      .subscribe(data => {
        this.payment = data;
      })
    
    this.rForm = fb.group({
      'email': [null, Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      'password':[null,Validators.required]
    });

  }
  user = new UserLogin('', '');

  submitted = false;

  onSubmit(post) {
    this.email = post.email;
    this.password = post.password;
  }

}
