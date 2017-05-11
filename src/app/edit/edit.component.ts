import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AtletasService } from "../atletas/atletas.service";
import { CategoriasService } from "../categorias/categorias.service";
import { AtletaService } from "../atleta/atleta.service";
import { AngularFire, FirebaseListObservable } from "angularfire2";
import { AuthService } from "../auth/auth.service";
import { AuthCorreo, AuthGoogle } from "../auth/auth";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  private auth : AuthGoogle;
  private atleta : any;

  public key : any;

  public listCategorias : FirebaseListObservable<any>;
  public categoriaActual : FirebaseListObservable<any>;

  public aux_categorias : any;
  public aux_categoria : any;
  public categoria_actual;

  selectedValue: string;
  selectedCategoria : string;
  nombreCategoria : string;

  constructor( private authService : AuthService,
               private af : AngularFire,
               private atletaService : AtletaService,
               private categoriasService : CategoriasService,
               private atletasService : AtletasService,
               private router : Router) {
    //Nos subscribimos y cargamos los datos de auth
    this.af.auth.subscribe( (data : any) => {
      if(data){
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
                data.forEach (cat => {
                  this.categoria_actual = cat;
                  this.nombreCategoria = cat.nombre;

                })
              })
            })
          });
        })

      this.getCategorias();
      
      }else{
        this.auth = null;
        this.atleta = null;
      }

    })
  } // fin del constructor
  ngOnInit() {
  }
  getCategorias(){
    this.listCategorias = this.categoriasService.categorias;

    this.listCategorias.subscribe(aux_categorias => {
      this.aux_categorias = aux_categorias;
    })
  }
  updateCategoria(){
    if(this.selectedCategoria!=""){
      this.categoriasService
      .getCategoria(this.selectedValue)
      .subscribe(aux_categoria => {
        aux_categoria.forEach(cat => {
          this.selectedCategoria = cat.nombre;
        })
      })
    }
  }
  updateCategory(categoria){
    this.atletasService.updateCategory(this.key, this.selectedValue);
  }
  updateName(name){
    if(name.value!=""){
     this.atletasService.updateName(this.key, name.value);
    }
  }

}
