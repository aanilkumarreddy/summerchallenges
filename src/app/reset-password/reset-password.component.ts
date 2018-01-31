import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { RouterModule, Routes, Router } from '@angular/router';
import { AngularFire } from 'angularfire2';
import { Http } from '@angular/http/src/http';
import { EmailService } from '../email-service/email.service';
import { AtletasService } from '../atletas/atletas.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public error: string = null;
  public done:boolean = false;
  private emptyField:boolean = false;

  private rForm: FormGroup;
  private email: string = '';
  private password: string = '';
  private atleta: any;
  private auth: any;

  constructor(
    private af: AngularFire,
    private authService: AuthService,
    private fb: FormBuilder,
    private emailService: EmailService,
    private atletaService: AtletasService,
    private router: Router
  ){
    this.af.auth.subscribe(data => {
      if(!data) {
        this.router.navigate(['/login']);
      }else {
        this.auth = data.auth;
      }
    })

    this.rForm = fb.group({
      'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ngOnInit() {
  }
  validarCampo(campo) {
    if (!this.rForm.controls[campo].valid && this.rForm.controls[campo].touched) return true;
    if (campo != "password" && this.emptyField) return true;
    return false;
  }
  validarFallo(campo) {
    if ( campo == "password"  && this.error == "Contraseña incorrecta") return true;
    return false;
  }
  redirect() {
    this.router.navigate(['/dashboard']);
  }
  resetPassword() {
      this.atleta = this.atletaService.getAtleta_byEmail(this.auth.email);
      this.auth.updatePassword(this.rForm.value.password).then(() => {
        this.atleta.subscribe(atl => {
         atl.forEach(aux_atl => {
          this.atletaService.updatePassword(aux_atl.$key, this.rForm.value.password)
          .then(() => {
            //Password cambiado en Firebase.
            this.emailService.send('registro', aux_atl.$key).subscribe(data => {
              this.done = true;
              window.setTimeout(() => {
                this.router.navigate(['/dashboard']);
              }, 1000);
            })
          }).catch(error => {
            console.log(error);
          })
         })
        })
      }).catch(error => {
        console.log(error);
      })
  }

}
