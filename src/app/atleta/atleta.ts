import { AtletasService } from "../atletas/atletas.service";
import { Inject } from "@angular/core";

export class Atleta {

    constructor(public nombre,
        public dni,
        public box,
        public email,
        public id_categoria,
        public password,
        public inscripcion,
        public estado,
        public id_coach?
    ) {
        this.nombre = nombre;
        this.dni = dni;
        this.box = box;
        this.email = email;
        this.estado = 0;
        this.id_categoria = id_categoria;
        this.password = password;
        this.id_coach = id_coach || "";
        this.inscripcion = inscripcion;
    }
}