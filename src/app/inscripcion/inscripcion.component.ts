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
import { InscripcionService } from "./inscripcion.service";
import { Inscripcion } from "./inscripcion";


@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.css']
})
export class InscripcionComponent implements OnInit {
  private auth : any;
  private atleta : any;

  constructor(private categoriasService : CategoriasService,
              private af : AngularFire,
              private atletasService : AtletasService,
              private authService : AuthService,
              private router : Router,
              private inscripcionService : InscripcionService) { 

              this.af.auth.subscribe((data:any) => {
                if(data){
                  this.auth = data.auth;
                  console.log(data.auth);
                  this.atleta = this.atletasService.getAtleta_byEmail(data.auth.email);
                }else{
                  this.auth = null;
                }
              })
              }

  ngOnInit() {
    console.log(this.auth);
  }

  generarInscripcion(atleta){
    const aux_inscripcion = new Inscripcion(atleta.email, atleta.id_categoria, 1);
    this.inscripcionService.pushInscripcion(atleta);
  }
}