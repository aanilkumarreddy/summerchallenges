import { Component, OnInit } from '@angular/core';
import { CategoriasService } from "../categorias/categorias.service";
import { FirebaseListObservable, AngularFire } from "angularfire2";
import { Atleta } from "../atleta/atleta";
import { AtletasService } from "../atletas/atletas.service";
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
  selector: 'app-registro-team',
  templateUrl: './registro-team.component.html',
  styleUrls: ['./registro-team.component.css']
})
export class RegistroTeamComponent implements OnInit {

  public listCategorias: FirebaseListObservable<any>;
  public emptyField: boolean = false;
  public aux_categorias: any;
  public aux_categoria: any;
  public error: any = "Introduce los datos para realizar el pago";


  private rForm: FormGroup;
  private name: string = '';
  private email: string = '';
  private password: string = '';
  private box: string = '';
  private category: string = '';
  private selectedCategory: string;
  private precio: number = 32.10;

  public emailRegularExpression = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public dniRegularExpression = /^\d{8}[a-zA-Z]$/;

  constructor(
    private categoriasService: CategoriasService,
    private af: AngularFire,
    private atletasService: AtletasService,
    private authService: AuthService,
    private router: Router,
    private inscripcionService: InscripcionService,
    private fb: FormBuilder,
    private emailService: EmailService
  ) {

    this.rForm = fb.group({
      'teamName': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30)])],
      'category': [null, Validators.required],
      'name1': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(400)])],
      'dni1': [null, Validators.compose([Validators.required, Validators.pattern(this.dniRegularExpression)])],
      'name2': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
      'dni2': [null, Validators.compose([Validators.required, Validators.pattern(this.dniRegularExpression)])],
      'email': [null, Validators.compose([Validators.required, Validators.pattern(this.emailRegularExpression)])],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      'passwordConfirm': [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });

    this.getCategorias();
    this.af.auth.subscribe((data: any) => {
      if (data) {
        this.router.navigate(['/dashboard']);
      }
    })
  }

  ngOnInit() { }

  getCategorias() {
    this.listCategorias = this.categoriasService.categorias;

    this.listCategorias.subscribe(aux_categorias => {
      this.aux_categorias = this.aux_categorias = aux_categorias.filter(item => item.c_id == 3 || item.c_id == 4);
    })
  }

  enviarDatos() {
    let formValues = this.rForm.value;
    if (!this.rForm.valid) {
      this.emptyField = true;
      return;
    }

    // const aux_correo: string = formValues.email;
    // let kk = aux_correo.toLowerCase();
    // const inscripcion = new Inscripcion(1, "Sin confirmar", "Sin confirmar");
    // const atleta = new Atleta(formValues.name, formValues.dni, formValues.box, kk, formValues.category, formValues.password, inscripcion);
    let atletaEquipo = {
      nombre: formValues.teamName,
      id_categoria: formValues.category,
      password: formValues.password,
      email: formValues.email,
      estado: 0,
      equipo: {
        name1: formValues.name1,
        name2: formValues.name2,
        dni1: formValues.dni1,
        dni2: formValues.dni2,
      }
    }
    console.log(atletaEquipo);
    // this.registroAtleta(formValues.name1, formValues.password);
    this.registroAtleta(atletaEquipo, formValues.password);

  }

  registroAtleta(atleta, password) {
    const aux_observable = this.atletasService.getAtleta_byEmail(atleta.email).subscribe(data => {
      if (data.length == 0) {
        this.authService.createUser(atleta.email, password)
          .then(data => {
            /*const inscripcion = this.generarInscripcion(atleta);*/
            let aux_atleta = this.atletasService.pushAtleta(atleta);
            this.emailService.send('registro', aux_atleta.key)
              .subscribe(data => {
                /*
                *  Código para cambiar el estado del atleta
                *  dependiendo si la respuesta es positiva
                */
                console.log(data);
              })
            //this.router.navigateByUrl(['/confirmacion']); 
          })
          .catch(error => {
            this.error = error.message;
          })
      } else {
        this.error = "emailErr";
      }
    })
  }

  /*
  generarInscripcion(atleta){
    const aux_inscripcion = new Inscripcion(atleta.email, atleta.id_categoria);
    return aux_inscripcion;
    //this.inscripcionService.pushInscripcion(aux_inscripcion);
  }
  */

  actualizarPrecio() {
    this.categoriasService
      .getCategoria(this.rForm.value.category)
      .subscribe(aux_categoria => {
        aux_categoria.forEach(cat => {
          this.precio = cat.precio;
          this.selectedCategory = cat.nombre;
        })
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

