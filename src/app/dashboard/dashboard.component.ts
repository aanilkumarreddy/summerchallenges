import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from "@angular/router";
import { AuthService } from '../auth/auth.service';
import { AngularFire, FirebaseListObservable } from "angularfire2";
import { AuthCorreo } from "../auth/auth";
import { Atleta } from "../atleta/atleta";
import { AtletasService } from "../atletas/atletas.service";
import { CategoriasService } from "../categorias/categorias.service";
import { RedSysAPIService } from '../redSysAPI/red-sys-api.service';
import { RedsysPayment } from '../models/redsys-payment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private auth : any;
  public key : any;
  public atleta : any;
  public categoria : any;
  public teamData : boolean;
  public team : any;
  private paymentData : any;

  constructor( private authService : AuthService,
               private af : AngularFire,
               private router : Router,
               private route: ActivatedRoute,
               private atletasService : AtletasService,
               private categoriasService : CategoriasService,
               private redsys : RedSysAPIService,) {
  //this.atleta = new Atleta("", "", "", "", "", "");
  //Nos subscribimos y cargamos los datos de auth para obtener el atleta actual
  //this.router.navigate(['/login']);

    this.team = {
                  'atl_1' : "",
                  'atl_2' : "",
                  'atl_3' : ""
                };
    this.af.auth.subscribe( (data : any) => {
      if(data){
        this.auth = data.auth;
        let aux_atleta = this.atletasService.getAtleta_byEmail(this.auth.email);
        aux_atleta.subscribe(data => {
          data.forEach(element => {
            const atleta_actual = this.atletasService.getAtleta_byKey(element.$key);
            atleta_actual.subscribe(data => {
              this.getTeam(data);
              this.atleta = data;
              this.key = data.$key;
              if(data.email == "info@summerchallenges.com"){
                this.router.navigate(['/admin']);
              }

              const categoria_actual = this.categoriasService.getCategoria(data.id_categoria);
              categoria_actual.subscribe(data => {
                data.forEach(element => {
                  this.categoria = element.nombre;
                })
              })
            })
          });
        })

      }else{
        this.auth = null;
        this.atleta = null;
        this.router.navigate(['/login']);
      }

    })
   }

  ngOnInit() {
  }

  isTeam(atleta){
    return atleta.id_categoria == 4 ? true : false;
  }
  getTeam(atleta){

    if(this.isTeam(atleta)){
      this.teamData = true;
      if(!atleta.atl_1){
        return
      }else{
        this.team.atl_1 = atleta.atl_1 || "";
        this.team.atl_2 = atleta.atl_2 || "";
        this.team.atl_3 = atleta.atl_3 || "";
        let flag = false;
          if(this.team.atl_1.nombre == "" || this.team.atl_2.nombre == "" || this.team.atl_3.nombre == ""){
            this.teamData = true;
          }else{
            this.teamData = false;
          }
      }
    }
  }

  closeModal(){
    const modal = document.querySelector('.team-modal');

    modal.classList.add('off');
    this.removeBlur();
  }

  removeBlur(){
    const dashboard = document.querySelector('#dashboard');
    dashboard.classList.remove('blur');
  }

  addAthlete_1(name, id){
    if(!this.atleta.atl_1){
        let atl_1 = {
          nombre : name.value,
          id : id.value
        };
      this.atletasService.updateTeam_1(this.key, atl_1);
    }
  }
  addAthlete_2(name, id){
    if(!this.atleta.atl_2){
        let atl_1 = {
          nombre : name.value,
          id : id.value
        };
      this.atletasService.updateTeam_2(this.key, atl_1);
    }
  }
  addAthlete_3(name, id){
    if(!this.atleta.atl_3){
        let atl_1 = {
          nombre : name.value,
          id : id.value
        };
      this.atletasService.updateTeam_3(this.key, atl_1);
    }
  }

  pay() {
    //TODO - Eliminar, es sólo para test.
    console.log(this.atleta.$key);

    // Obtenemos los datos de pago de la API
    let payment = this.redsys.getData(this.atleta.$key);

    //Nos suscribimos a la respuesta de la API
    payment.subscribe(data => {
      //Formulario de envio de datos para Redsys
      let payment_form : HTMLFormElement = document.createElement('form');
      payment_form.setAttribute('method', 'POST');
      payment_form.setAttribute('action', data.url);
      payment_form.setAttribute('target', '_blank');

      //Input con los parametros de la compra devueltos por la API - Datos obligatorios + opcionales + urls
      let params : HTMLInputElement = document.createElement('input');
      params.setAttribute('name', 'Ds_MerchantParameters');
      params.setAttribute('type', 'hidden');
      params.setAttribute('value', data.params);
      payment_form.appendChild(params);

      //Input con la versión de la firma de RedSys - Obligatorio
      let version : HTMLInputElement = document.createElement('input');
      version.setAttribute('name', 'Ds_SignatureVersion');
      version.setAttribute('type', 'hidden');
      version.setAttribute('value', data.version);
      payment_form.appendChild(version);

      //Input con la firma de Redsys - Obligatorio
      let signature : HTMLInputElement = document.createElement('input');
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
