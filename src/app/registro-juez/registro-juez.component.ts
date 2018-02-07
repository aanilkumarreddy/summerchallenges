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
import { EmailService } from '../email-service/email.service';

@Component({
  selector: 'app-registro-juez',
  templateUrl: './registro-juez.component.html',
  styleUrls: ['./registro-juez.component.css']
})
export class RegistroJuezComponent {

  private error;
  private especialRegistrado: boolean = false;

  private emptyField: boolean = false;
  private rForm: FormGroup;
  private name: string = '';
  private dni: string = '';
  private email: string = '';
  private password: string = '';
  private passwordConfirm: string = '';

  private emailRegularExpression = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public dniRegularExpression = /^[XYZxyz]?\d{7,8}[a-zA-Z]$/;

  constructor(
    private af: AngularFire,
    private juecesService: JuecesService,
    private authService: AuthService,
    private router: Router,
    private inscripcionService: InscripcionService,
    private fb: FormBuilder,
    private emailService : EmailService
  ) {
    this.rForm = fb.group({
      'name': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
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
        juez.email = juez.email.toLowerCase();
        this.authService.createUser(juez.email, password)
          .then(data => {
            let aux_juez = this.juecesService.pushJuez(juez);
            this.emailService.send('juez', aux_juez.key)
              .subscribe((data:any) => {
                if(data._body == "1") this.especialRegistrado = true
              })
          })
          .catch(error => {
            this.error = error.message;
          })
      } else {
        this.error = "emailErr";

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
