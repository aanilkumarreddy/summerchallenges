import { Injectable } from "@angular/core";
import { AtletasService } from "./atletas/atletas.service";
import { filter } from "rxjs/operator/filter";
import * as _ from 'lodash';  


@Injectable()
export class OrdenarPuestosService {
  public atletas;
  public aux_atletas;

  constructor(private atletasService: AtletasService) {}

  getPayedAtletas() {
    let atletasSubscribe = this.atletasService
      .getAtletas()
      .subscribe((data: any) => {
        this.atletas = data.filter(atleta => atleta.estado === 5);

        // Funcion forEach que recorra un arr con todas las categorias y ejecute calculateTotalScore(id_cateogoria)
        this.calculateTotalScore(1);
        atletasSubscribe.unsubscribe();
      });
  }

  orderScoreByWods(atletasArray, wod) {
    atletasArray = atletasArray.filter(atleta => atleta[wod.name]);

    this.orderByWodType(atletasArray, wod);

    let puesto = 0;
    atletasArray.forEach((atleta, index, atletasArr) => {
      console.log(atletasArr.map(a => a[wod.name].puntuacion));
      // Si no hay puntuacion
      if (!atleta[wod.name].puntuacion) {
        atleta[wod.name].puesto = 99;
        return;
      }

      puesto++;

      // Si index cero
      if (!index) {
        atleta[wod.name].puesto = puesto;
        return;
      }

      // Si empate
      let atletaAnterior = atletasArr[index - 1];

      if (atleta[wod.name].puntuacion === atletaAnterior[wod.name].puntuacion) {
        console.log("Tenemos empate puto");

        atleta[wod.name].puesto = atletaAnterior[wod.name].puesto;
        console.log(atletaAnterior[wod.name].puntuacion);
        console.log(atleta[wod.name].puntuacion);
      } else {
        // Normal
        atleta[wod.name].puesto = puesto;
      }
    });
    console.log(atletasArray.map(a => a[wod.name].puntuacion));
    console.log(atletasArray.map(a => a[wod.name].puesto));

    atletasArray.sort(
      (a, b) => (a[wod.name].puesto > b[wod.name].puesto ? 1 : -1)
    );

    atletasArray.forEach(atleta => {
      if (atleta[wod.name].puesto == 99) {
        atleta[wod.name].puesto = "-";
      }
    });
    console.log(atletasArray.map(a => a[wod.name].puesto));
    return atletasArray;
  }

  orderByWodType(atletasArray, wod) {
    let orden;
    if (wod.type === "desc")
      orden = (a, b) =>
        a[wod.name].puntuacion < b[wod.name].puntuacion ? 1 : -1;

    if (wod.type === "asc")
      orden = (a, b) =>
        a[wod.name].puntuacion > b[wod.name].puntuacion ? 1 : -1;

    // FORMATEAR SEGUN REPS O TIEMPO
    atletasArray.forEach(atleta => {
      atleta[wod.name].puntuacion = parseInt(atleta[wod.name].puntuacion);
    });

    atletasArray.sort(orden);
  }

  calculateTotalScore(id_cateogoria) {
    let atletasByCategory = this.atletas
      .filter(atleta => atleta)
      .filter(atleta => atleta.id_categoria === id_cateogoria);

    // Aqui recorrer objeto WodFinal que contendra la cantidad de wod a recorrer y posterior sumar puntuciones
    let wods = {
      totalScore: 0,
      totalRanking: 0,
      wodsArray: [
        {
          type: "desc",
          name: "??",
          dataScore: {
            reps: 0,
            kilos: 0,
            time: 0
          },
          score: 0,
          ranking: 0
        }
        // ...
      ]
    };
    // ELIMINAR ESTO
    let wod = {
      type: "desc",
      name: "wod_1b"
    };

    // Recorremos objeto wodFinal con for in para extraer scores por wod y extraer puesto por wod
    let wodsStructure = atletasByCategory[0].wods.wodsArray;
    wodsStructure.forEach(wod => {
      this.orderScoreByWods(atletasByCategory, wod);
    });

    // Finalmente extraemos scores totales y luego desempatamos
    atletasByCategory.forEach(atleta => {
      atleta.totalScore = atleta.wodsArray.reduce(
        (wodAnterior, wodActual) => wodActual.score + wodAnterior.score
      );
    });

    this.orderByTotalScore(atletasByCategory);

    // AQUI PONER EL DESEMPATADOR tieBreakScore();
  }

  orderByTotalScore(atletasArray) {
    let orden = (atletaAnterior, atletaActual) =>
      atletaAnterior.wods.totalScore < atletaActual.wods.totalScore ? 1 : -1;
    return atletasArray.sort(orden);
  }

  tieBreakScore(atletasArray) {
    // Obtenemos un array de arrays donde cada subArray son los atletas empatados entre si
    let atletasTieArray = this.getAtletasTieArray(atletasArray);

    // Desempatamos por prioridad de wod
    atletasTieArray.forEach(arrayAtletasEmpatados => {
      let ordenarPorMayorScore = (atletaAnterior, atletaActual) =>
      atletaAnterior.wods.wodsArray[0].score < atletaActual.wods.wodsArray[0].score ? 1 : -1;
      
      // Por aqui deberiamos comprobar si hay un nuevo empate (RECURSIVIDAD?)

      let ranking = 0;
      arrayAtletasEmpatados.sort(ordenarPorMayorScore).map(atleta=> {
        atleta.wods.totalRanking = atleta.wods.totalRanking + ranking;
        ranking++;
        return atleta
      });
    })

  }

  getAtletasTieArray(atletasArrayOriginal) {
    let atletasArray = _.cloneDeep(atletasArrayOriginal);
    let atletasTieArray = [];
    
    // Recorremos el array en busca de atletas empatados
    let indexPivote = 0;
    while(indexPivote < atletasArray.length) {
      let atletaPivote = atletasArray[indexPivote];
      let atletasTie = [];

      // Con el atleta pivote tenemos un indice de referencia que 
      // se compara con el resto de valores del array y si hay empate
      // pusheamos
      atletasArray.forEach((atleta, index) => {
        if (
          atletaPivote.wods.totalScore === atleta.wods.totalScore &&
          indexPivote !== index
        ) {
          atletasTie.push(atleta);
        }
      });

      // Si hay empates quitamos los atletas de esos empates para recorrer
      // Nuevamente el array en busca de los siguientes empates
      if (atletasTie.length) {
        atletasTie.push(atletaPivote);
        atletasTieArray.push(atletasTie);
        atletasArray = atletasArray.filter(
          atleta => atleta.wods.totalScore !== atletaPivote.wods.totalScore
        );
        indexPivote = 0;
        continue;
      }
      
      // Incrementamos indice
      indexPivote++;
    }
    return atletasTieArray;
  }
}
