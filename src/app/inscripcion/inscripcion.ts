import { InscripcionService } from "../inscripcion/inscripcion.service";
import { Inject } from "@angular/core";

export class Inscripcion {

    constructor(public estado, 
                public fecha, 
                public id_pedido,                
                ){
        this.estado = estado;
        this.fecha = fecha;
        this.id_pedido = id_pedido;
    }
}