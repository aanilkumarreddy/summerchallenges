import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AtletasService } from "../atletas/atletas.service";
import { CategoriasService } from "../categorias/categorias.service";
import { AtletaService } from "../atleta/atleta.service";
import { AngularFire, FirebaseListObservable } from "angularfire2";
import { AuthService } from "../auth/auth.service";
import { AuthCorreo, AuthGoogle } from "../auth/auth";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RedSysAPIService } from '../redSysAPI/red-sys-api.service';
import { RedsysPayment } from '../models/redsys-payment';
import { EmailService } from '../email-service/email.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  private changeCategoryMessage: string;
  private auth: AuthGoogle;
  private atleta: any;

  public key: any;

  public listCategorias: FirebaseListObservable<any>;
  public categoriaActual: FirebaseListObservable<any>;

  public aux_categorias: any;
  public aux_categoria: any;
  public categoria_actual;

  private rForm: FormGroup;
  private name: string = '';
  private category: string = '';

  // selectedCategoria: string;
  private nombreCategoria: string;
  private stateRequestForChangeOfCategory: string = '';

  private paymentData: any;

  constructor(private authService: AuthService,
    private af: AngularFire,
    private atletaService: AtletaService,
    private categoriasService: CategoriasService,
    private atletasService: AtletasService,
    private router: Router,
    private fb: FormBuilder,
    private redsys: RedSysAPIService,
    private emailService: EmailService
  ) {

    //Carga formulario
    this.rForm = fb.group({
      'name': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
      'category': [null, Validators.required]
    });

    //Nos subscribimos y cargamos los datos de auth
    this.af.auth.subscribe((data: any) => {
      if (data) {
        this.auth = data.auth;
        let aux_atleta = this.atletasService.getAtleta_byEmail(this.auth.email);
        aux_atleta.subscribe(data => {
          data.forEach(element => {
            const atleta_actual = this.atletasService.getAtleta_byKey(element.$key);
            atleta_actual.subscribe(data => {
              this.atleta = data;
              this.key = data.$key;

              this.categoriasService.getCategoria(data.id_categoria)
                .subscribe(data => {
                  data.forEach(cat => {
                    this.categoria_actual = cat;
                    this.nombreCategoria = cat.nombre;

                  })
                })
            })
          });
        })

        this.getCategorias();

      } else {
        this.auth = null;
        this.atleta = null;
      }

    })
  } // fin del constructor
  ngOnInit() {
  }
  getCategorias() {
    this.listCategorias = this.categoriasService.categorias;

    this.listCategorias.subscribe(aux_categorias => {
      this.aux_categorias = aux_categorias;
    })
  }

  // updateCategoria() {
  //   if (this.selectedCategoria != "") {
  //     this.categoriasService
  //       .getCategoria(this.category)
  //       .subscribe(aux_categoria => {
  //         aux_categoria.forEach(cat => {
  //           this.selectedCategoria = cat.nombre;
  //         })
  //       })
  //   }
  // }

  requestChangeOfCategory() {
    if (this.rForm.value.category == null) return;

    this.stateRequestForChangeOfCategory = 'sending';
    this.emailService.send('categoria-admin', this.atleta.$key + '/' + this.rForm.value.category)
      .subscribe((data: any) => {
        let newCategory = this.aux_categorias.filter(category => category.c_id == this.rForm.value.category);
        let prevCategory = this.aux_categorias.filter(category => category.c_id == this.atleta.id_categoria);

        this.changeCategoryMessage = "Tu solicitud de cambio de " + prevCategory[0].nombre + " a " + newCategory[0].nombre + " ha sido enviada"
        this.stateRequestForChangeOfCategory = 'sended';

      },
      err => {
        this.changeCategoryMessage = "Ha ocurrido un error. Consultelo con el organizador o inténtelo mas tarde."
      },
    );
  }

  updateName() {
    if (this.rForm.value.name != "") {
      this.atletasService.updateName(this.key, this.rForm.value.name);
    }
  }

  validarCampo(campo) {
    if (!this.rForm.controls[campo].valid && this.rForm.controls[campo].touched) return true;
    return false;
  }

  pay() {
    //TODO - Eliminar, es sólo para test.

    // Obtenemos los datos de pago de la API
    let payment = this.redsys.getData(this.atleta.$key);

    //Nos suscribimos a la respuesta de la API
    payment.subscribe(data => {
      //Formulario de envio de datos para Redsys
      let payment_form: HTMLFormElement = document.createElement('form');
      payment_form.setAttribute('method', 'POST');
      payment_form.setAttribute('action', data.url);
      payment_form.setAttribute('target', '_blank');

      //Input con los parametros de la compra devueltos por la API - Datos obligatorios + opcionales + urls
      let params: HTMLInputElement = document.createElement('input');
      params.setAttribute('name', 'Ds_MerchantParameters');
      params.setAttribute('type', 'hidden');
      params.setAttribute('value', data.params);
      payment_form.appendChild(params);

      //Input con la versión de la firma de RedSys - Obligatorio
      let version: HTMLInputElement = document.createElement('input');
      version.setAttribute('name', 'Ds_SignatureVersion');
      version.setAttribute('type', 'hidden');
      version.setAttribute('value', data.version);
      payment_form.appendChild(version);

      //Input con la firma de Redsys - Obligatorio
      let signature: HTMLInputElement = document.createElement('input');
      signature.setAttribute('name', 'Ds_Signature');
      signature.setAttribute('type', 'hidden');
      signature.setAttribute('value', data.signature);
      payment_form.appendChild(signature);

      document.body.appendChild(payment_form);

      //Enviamos formulario - Redireccionamiento a Redsys.
      payment_form.submit();
    })
  }

}
