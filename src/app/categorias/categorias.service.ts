import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from "angularfire2";


@Injectable()
export class CategoriasService {

  public categorias : FirebaseListObservable <any []>;
  public categoria : FirebaseListObservable <any>;
  public aux_categoria : any;

  constructor(private af : AngularFire) {
    this.categorias = af.database.list('/Categorias');
    this.categorias.subscribe(data =>{
      this.aux_categoria = data;
    })
   }

  getCategoria(id:string){
   this.categoria = this.af.database.list('/Categorias', {
      query : {
        orderByChild: 'c_id',
        equalTo: id,
      }
    })
    return this.categoria;
  }
  setCategoriaActual(id){
    const aux_categoria = this.af.database.object('/Categorias/'+id);
    aux_categoria.subscribe(data => {
      this.categoria = data;
    })
  }
  

}
