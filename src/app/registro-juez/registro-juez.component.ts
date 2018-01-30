import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable, AngularFire } from "angularfire2";
import { Atleta } from "../atleta/atleta";
import { JuecesService } from "../jueces/jueces.service";
import { AuthCorreo } from "../auth/auth";
import { AuthService } from "../auth/auth.service";
import { Router } from "@angular/router";
import { AtletasComponent } from "../atletas/atletas.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { Inscripcion } from "../inscripcion/inscripcion";
import { InscripcionService } from "../inscripcion/inscripcion.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro-juez',
  templateUrl: './registro-juez.component.html',
  styleUrls: ['./registro-juez.component.css']
})
export class RegistroJuezComponent {

  private error;

  private emptyField: boolean = false;
  private rForm: FormGroup;
  private name: string = '';
  private dni: string = '';
  private email: string = '';
  private password: string = '';
  private passwordConfirm: string = '';

  private emailRegularExpression = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private dniRegularExpression = /^\d{8}[a-zA-Z]$/;

  constructor(
    private af: AngularFire,
    private juecesService: JuecesService,
    private authService: AuthService,
    private router: Router,
    private inscripcionService: InscripcionService,
    private fb: FormBuilder
  ) {
    this.rForm = fb.group({
      'name': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      'dni': [null, Validators.compose([Validators.required, Validators.pattern(this.dniRegularExpression)])],
      'email': [null, Validators.compose([Validators.required, Validators.pattern(this.emailRegularExpression)])],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      'passwordConfirm': [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });

  }

  enviarDatos() {
    let formValues = this.rForm.value;
    if (!this.rForm.valid) {
      this.emptyField = true;
      return;
    }

    const juez = {
      name: formValues.name,
      dni: formValues.dni,
      email: formValues.email.toLowerCase(),
      password: formValues.password
    }

    this.registroJuez(juez, formValues.password);

  }

  registroJuez(juez, password) {
    const aux_observable = this.juecesService.getJuez_byEmail(juez.email).subscribe(data => {
      if (data.length == 0) {
        this.authService.createUser(juez.email, password)
          .then(data => {
            this.juecesService.pushJuez(juez);
          })
          .catch(error => {
            this.error = error.message;
            console.log(this.error);
          })
      } else {
        this.error = "emailErr";
            console.log(this.error);
        
      }
    })
  }

  validarCampo(campo) {
    if (!this.rForm.controls[campo].valid && this.rForm.controls[campo].touched) return true;
    if (!this.rForm.controls[campo].valid && this.emptyField) return true;
    return false;
  }

  validarPassword() {
    let formValues = this.rForm.value;
    if (formValues.password != formValues.passwordConfirm && this.rForm.controls['passwordConfirm'].touched) return true;
    return false;
  }

}
