import { Component, OnInit } from '@angular/core';
import { CategoriasService } from '../categorias/categorias.service';
import { AtletasService } from '../atletas/atletas.service';
import { Router, RouterModule, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-public-panel',
  templateUrl: './public-panel.component.html',
  styleUrls: ['./public-panel.component.css']
})
export class PublicPanelComponent implements OnInit {
  private atletas : any;
  private categorias : any;
  private list : any;
  public activeCategoria = {
    nombre: "",
    id: 0
  };

  constructor(private categoriasService: CategoriasService,
              private atletasService: AtletasService,
              private route: ActivatedRoute,
              private router: Router) {
                /*
    this.atletasService.getAtletas().subscribe(data => {
      this.atletas = data;
      this.filter(1, "RX Masculino");
    })

    this.categoriasService.getCategorias().subscribe(data => {
      this.categorias = data;
    })*/

  //Fin constructor
  }

  ngOnInit() {
    this.atletasService.getAtletas().subscribe(data => {
      this.atletas = data;
      this.categoriasService.getCategorias().subscribe(data => {
        this.categorias = data;
        this.filter(1, "RX Masculino");
      })
    })
  }

  activate(id_cat) {
    let cat = this.categorias.filter(cat => {
      cat.estado = "off";
      return cat.c_id == id_cat
    });
    cat[0].estado = "on";
  }

  filter(id_cat, name_cat) {
    this.activeCategoria.nombre = name_cat;
    this.activeCategoria.id = id_cat;
    this.activate(id_cat);
    this.list = this.atletas.filter(atl => {
      return atl.id_categoria == id_cat
    });
    this.list.sort((a, b) => {
      return b.estado - a.estado;
    })
  }

  redirect(url) {
    this.router.navigate([url]);
  }

}
