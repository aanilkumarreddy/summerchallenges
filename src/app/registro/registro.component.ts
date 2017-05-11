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

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  public listCategorias : FirebaseListObservable<any>;
  public categoriaActual : FirebaseListObservable<any>;

  public aux_categorias : any;
  public aux_categoria : any;
  public error : any = "Introduce los datos para realizar el pago";

  selectedValue: string;
  selectedCategoria : string;
  precio : number = 16.05;
  public bandera;

  
  constructor(private categoriasService : CategoriasService,
              private af : AngularFire,
              private atletasService : AtletasService,
              private authService : AuthService,
              private router : Router,
              private inscripcionService : InscripcionService
              ) {
    this.getCategorias();
    this.af.auth.subscribe( (data : any) => {
      if(data){
        this.router.navigate(['/dashboard']);
      }else{

      }

    })
  }

  ngOnInit() {}

  getCategorias(){
    this.listCategorias = this.categoriasService.categorias;

    this.listCategorias.subscribe(aux_categorias => {
      this.aux_categorias = aux_categorias;
    })
  }

  enviarDatos(nombre, correo, password, box, categoria){
    if(nombre.value=="" || box.value=="" || correo.value=="" || password.value==""|| categoria.value ==""){
      this.error = "Debe rellenar todos los campos para continuar";
    }
    else{
      const aux_correo:string = correo.value;
      let kk = aux_correo.toLowerCase();
      const inscripcion = new Inscripcion(1, "Sin confirmar", "Sin confirmar");
      const atleta = new Atleta(nombre.value, box.value, kk, this.selectedValue, password.value, inscripcion);
      this.registroAtleta(atleta, password.value);
    }
  }

  registroAtleta(atleta, password){    
    const aux_observable = this.atletasService.getAtleta_byEmail(atleta.email).subscribe ( data => {
      if(data.length == 0){
        this.authService.createUser(atleta.email, password)
          .then(data => {
            /*const inscripcion = this.generarInscripcion(atleta);*/
            this.atletasService.pushAtleta(atleta);
            
            //this.router.navigateByUrl(['/confirmacion']); 
          })
          .catch(error => {
            this.error = error.message;
          })        
      }else{
        this.error = "EMAIL NO DISPONIBLE, PRUEBA OTRO O, INICIA SESIÓN";
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

  actualizarPrecio(){
      this.categoriasService
      .getCategoria(this.selectedValue)
      .subscribe(aux_categoria =>{
        aux_categoria.forEach(cat => {
          this.precio = cat.precio;
          this.selectedCategoria = cat.nombre;
        })
      })
  }

}
