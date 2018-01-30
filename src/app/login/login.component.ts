import { Component, OnInit } from '@angular/core';
import { AuthCorreo } from "../auth/auth";
import { RouterModule, Routes, Router } from '@angular/router';
import { AuthService } from "../auth/auth.service";
import { AngularFire } from "angularfire2";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public error: string = null;
  private emptyField:boolean = false;

  private rForm: FormGroup;
  private email: string = '';
  private password: string = '';

  emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(
    private af: AngularFire,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {

    this.af.auth.subscribe(data => {
      if(data) {
        this.router.navigate(['/dashboard']);
      }
    })

    this.rForm = fb.group({
      'email': [null, Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });

  }

  login_correo() {
    let formValues = this.rForm.value;
    this.authService.login_correo(formValues.email, formValues.password)
      .then(promise => { this.router.navigate(['/dashboard']) },
      (error: any) => {
        if (error.code == "auth/user-not-found") this.error = "Email no registrado";
        if (error.code == "auth/wrong-password") this.error = "Contraseña incorrecta";
      }
      );
  }

  validarCampo(campo) {
    if (!this.rForm.controls[campo].valid && this.rForm.controls[campo].touched) return true;
    return false;
  }

  validarFallo(campo) {
    if ( campo == "email"  && this.error == "Email no registrado") return true;
    if ( campo == "password"  && this.error == "Contraseña incorrecta") return true;
    return false;
  }

}
