import { Component, OnInit } from '@angular/core';
import { CategoriasService } from '../categorias/categorias.service';
import { WodsService } from '../wods/wods.service';
import { AtletasService } from '../atletas/atletas.service';
import { AuthService } from '../auth/auth.service';
import { AngularFire } from 'angularfire2';

@Component({
  selector: 'app-requisitos',
  templateUrl: './requisitos.component.html',
  styleUrls: ['./requisitos.component.css']
})
export class RequisitosComponent implements OnInit {
  public categorias: any;
  public categoria_actual: any;
  public categoria_feak: any;

  public wods: any;
  public wod_actual: any;

  public auth: any;

  public atletas: any;


  constructor(
    private categoriasService: CategoriasService,
    private wodService: WodsService,
    private authService: AuthService,
    private af: AngularFire,
    private atletasService: AtletasService
  ) {
    categoriasService.getCategorias().subscribe(data => {
      this.categorias = data;
      this.categoria_actual = data[0];
    })

    wodService.getWods().subscribe(data => {
      this.wods = data;
      this.wod_actual = data[0];
    })

    this.af.auth.subscribe(data => {
      if (data) {
        this.auth = data.auth;
      }
    })

    this.atletasService.atletas.subscribe(data => {
      this.atletas = data;
    })

  }

  ngOnInit() {
  }

  animateInfoPanel(e) {
    let feak = document.querySelector('.info__fake');

    // Actualizamos los datos a mostrar
    setTimeout(() => {
      this.wod_actual = e;
    }, 400)

    // Aplicamos animacion out
    feak.classList.add('out');

    // Le quitamos la clase de la animación out
    setTimeout(() => {
      feak.classList.remove('out');
    }, 500)
  }

  activateCategory(e, event) {
    const options = Array.from(document.querySelectorAll('.option'));
    options.forEach(option => {
      option.classList.remove('active');
    })

    this.animateInfoPanel(e);
    event.target.classList.add('active');
  }

}
