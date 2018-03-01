import { Component, OnInit } from '@angular/core';
import { CategoriasService } from '../categorias/categorias.service';

@Component({
  selector: 'app-requisitos',
  templateUrl: './requisitos.component.html',
  styleUrls: ['./requisitos.component.css']
})
export class RequisitosComponent implements OnInit {
  public categorias: any;
  public categoria_actual: any;
  public categoria_feak: any;


  constructor(categoriasService: CategoriasService) {
    categoriasService.getCategorias().subscribe(data => {
      this.categorias = data;
      console.log(data[0]);
      this.categoria_actual = data[0];
    })
  }

  ngOnInit() {
  }

  animateInfoPanel(e) {
    let feak = document.querySelector('.info__fake');

    // Actualizamos los datos a mostrar
    setTimeout(() => {
      this.categoria_actual = e;
    }, 200)

    // Aplicamos animacion out
    feak.classList.add('out');

    // Le quitamos la clase de la animación out
    setTimeout(() => {
      feak.classList.remove('out');
    }, 500)
  }

  activateCategory(e, event) {
    const options = document.querySelectorAll('.option');

    options.forEach(option => {
      option.classList.remove('active');
    })

    this.animateInfoPanel(e);
    event.target.classList.add('active');
  }

}
