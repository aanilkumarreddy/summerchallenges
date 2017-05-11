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
import { InscripcionService } from "../inscripcion/inscripcion.service";
import { Inscripcion } from "../inscripcion/inscripcion";


@Component({
  selector: 'app-form-redsys',
  templateUrl: './form-redsys.component.html',
  styleUrls: ['./form-redsys.component.css']
})
export class FormRedsysComponent implements OnInit {

  constructor(private categoriasService : CategoriasService,
              private af : AngularFire,
              private atletasService : AtletasService,
              private authService : AuthService,
              private router : Router,
              private inscripcionService : InscripcionService) { }

  ngOnInit() {
  }

  generarInscripcion(atleta){
    /*const aux_inscripcion = new Inscripcion(atleta.email, atleta.id_categoria);
    this.inscripcionService.pushInscripcion(atleta);*/
  }
}
