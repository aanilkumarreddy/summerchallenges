import { Component, OnInit } from '@angular/core';
import { AuthCorreo } from "../auth/auth";
import { RouterModule, Routes, Router } from '@angular/router';
import { AuthService } from "../auth/auth.service";
import { AngularFire } from "angularfire2";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit { 
  public error : string = "Introduce tus credenciales para iniciar sesión";
  constructor(private af : AngularFire,
              private router : Router,
              private authService : AuthService
              ) { 
    this.af.auth.subscribe( (data : any) => {
      if(data){
      }else{
      }

    })
              }

  ngOnInit() {
  }

  login_correo(email : HTMLInputElement, password : HTMLInputElement){    
    this.authService.login_correo(email.value, password.value)
      .then(promise => {this.router.navigate(['/dashboard'])},
      error => {
        if(error.message == "The password is invalid or the user does not have a password."){
          this.error = "El password no es correcto o el correo electrónico no está registrado en nuestro sistema";
        }else{
          this.error = error.message;
        }
      }
      );
    }


}
