import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from "@angular/router";
import { AuthService } from '../auth/auth.service';
import { AngularFire, FirebaseListObservable } from "angularfire2";
import { AuthCorreo } from "../auth/auth";
import { Atleta } from "../atleta/atleta";
import { AtletasService } from "../atletas/atletas.service";
import { CategoriasService } from "../categorias/categorias.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private auth : any;
  public key : any;
  public atleta : Atleta;
  public categoria : any;
  constructor( private authService : AuthService,
               private af : AngularFire,
               private router : Router,
               private route: ActivatedRoute,
               private atletasService : AtletasService,
               private categoriasService : CategoriasService) {
  this.atleta = new Atleta("", "", "", "", "", ""); 
  //Nos subscribimos y cargamos los datos de auth para obtener el atleta actual
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

}
