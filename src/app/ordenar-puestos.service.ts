import { Injectable } from "@angular/core";
import { AtletasService } from "./atletas/atletas.service";
import { filter } from "rxjs/operator/filter";
import * as _ from "lodash";

@Injectable()
export class OrdenarPuestosService {
  public atletas;
  public aux_atletas;
  public KEY_SUPERFALSA = 0;

  constructor(private atletasService: AtletasService) {}

  getPayedAtletas() {
    let atletasSubscribe = this.atletasService
      .getAtletas()
      .subscribe((data: any) => {
        this.atletas = data.filter(atleta => atleta.estado === 5);

        // PRUEBAS MOCKS
        let atletasPrueba = [
          this.createMockAtletaWod(25, "asc", 120, 100, 10),
          this.createMockAtletaWod(22, "asc", 120, 100, 59),
          this.createMockAtletaWod(15, "asc", 120, 100, 94),
          this.createMockAtletaWod(22, "asc", 125, 100, 70),
          this.createMockAtletaWod(22, "asc", 125, 100, 101),
          this.createMockAtletaWod(22, "asc", 128, 100, 101),
          this.createMockAtletaWod(22, "asc", 119, 100, 102),
          this.createMockAtletaWod(10, "asc", 120, 100, 102),
          this.createMockAtletaWod(19, "asc", 120, 100, 103),
          this.createMockAtletaWod(12, "asc", 120, 100, 105),
          this.createMockAtletaWod(18, "asc", 120, 100, 101)
        ];

        let atletasOrdenadosPorTotalScore = this.orderByTotalScore(
          atletasPrueba
        );
        let rankeados = this.addRankig(atletasOrdenadosPorTotalScore);
        let rankeadosSoloDesempatados = this.tieBreakScore(rankeados);
        let rankeadosDefinitivos = this.insertTieBreakAtletas(
          rankeadosSoloDesempatados,
          rankeados
        );

        console.log("rankeadosDefinitivos", rankeadosDefinitivos);

        // Funcion forEach que recorra un arr con todas las categorias y ejecute calculateTotalScore(id_cateogoria)
        // this.calculateTotalScore(1);
        atletasSubscribe.unsubscribe();
      });
  }

  // CREAMOS WODS FALSOS PARA HACER LAS PRUEBAS
  createMockAtletaWod(totalscore, type, subScore, maxTime?, time?) {
    this.KEY_SUPERFALSA++;
    return {
      wods: {
        totalScore: totalscore,
        totalRanking: 0,
        wodsArray: [
          {
            type: type,
            name: "??",
            dataScore: {
              reps: 0,
              kilos: 0,
              time: time || 0,
              maxTime: maxTime || 0
            },
            score: subScore,
            ranking: 0
          }
          // ...
        ]
      },
      key: this.KEY_SUPERFALSA
    };
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

    let atletasByCategoryOrdenado = this.orderByTotalScore(atletasByCategory);
    let atletasByCategoryApplyRanking = this.addRankig(
      atletasByCategoryOrdenado
    );

    this.tieBreakScore(atletasByCategoryApplyRanking);
  }

  addRankig(atletasByCategoryOrdenado) {
    let ranking = 1;
    let atletasByCategoryApplyRanking = atletasByCategoryOrdenado.map(
      (atleta, index, self) => {
        if (index === 0) {
          atleta.wods.totalRanking = atleta.wods.totalRanking + ranking;
        } else {
          if (atleta.wods.totalScore === self[index - 1].wods.totalScore) {
            atleta.wods.totalRanking = self[index - 1].wods.totalRanking;
          } else {
            atleta.wods.totalRanking = atleta.wods.totalRanking + ranking;
          }
        }
        ranking++;
        return atleta;
      }
    );
    return atletasByCategoryApplyRanking;
  }

  addRankingByWods(arrayAtletasEmpatados, ordenar, ranking) {
    return arrayAtletasEmpatados.sort(ordenar).map((atleta, index, self) => {
      if (index === 0) {
        atleta.wods.totalRanking = atleta.wods.totalRanking + ranking;
        ranking++;
        return atleta;
      }

      let scoreAtletaActual =
        atleta.wods.wodsArray[atleta.wods.wodsArray.length - 1].score;
      let scoreAtletaAnterior =
        self[index - 1].wods.wodsArray[
          self[index - 1].wods.wodsArray.length - 1
        ].score;

      if (scoreAtletaActual === scoreAtletaAnterior) {
        return "empate";
      } else {
        atleta.wods.totalRanking = atleta.wods.totalRanking + ranking;
        ranking++;
        return atleta;
      }
    });
  }

  orderByTotalScore(atletasArray) {
    let orden = (atletaAnterior, atletaActual) =>
      atletaAnterior.wods.totalScore < atletaActual.wods.totalScore ? 1 : -1;
    return atletasArray.sort(orden);
  }

  tieBreakScore(atletasArray) {
    // Obtenemos un array de arrays donde cada subArray son los atletas empatados entre si
    let atletasTieArray = this.getAtletasTieArray(atletasArray);
    let arrayDesempatados = [];

    // Desempatamos por prioridad de wod
    atletasTieArray.forEach(arrayAtletasEmpatados => {
      let typeSortOfLastWod = this.getTypeSortOfLastWod(
        arrayAtletasEmpatados[0]
      );
      let masMejor = (atletaAnterior, atletaActual) =>
        atletaAnterior.wods.wodsArray[atletaAnterior.wods.wodsArray.length - 1]
          .score <
        atletaActual.wods.wodsArray[atletaActual.wods.wodsArray.length - 1]
          .score
          ? 1
          : -1;
      let menosMejor = (atletaAnterior, atletaActual) =>
        atletaAnterior.wods.wodsArray[atletaAnterior.wods.wodsArray.length - 1]
          .score <
        atletaActual.wods.wodsArray[atletaActual.wods.wodsArray.length - 1]
          .score
          ? -1
          : 1;
      let menosMejorSiTime = (atletaAnterior, atletaActual) =>
        atletaAnterior.wods.wodsArray[atletaAnterior.wods.wodsArray.length - 1]
          .dataScore.time <
        atletaActual.wods.wodsArray[atletaActual.wods.wodsArray.length - 1]
          .dataScore.time
          ? -1
          : 1;

      if (typeSortOfLastWod === "asc")
        arrayDesempatados = this.orderByTime(
          arrayAtletasEmpatados,
          menosMejorSiTime
        );
      else if (typeSortOfLastWod === "desc")
        arrayDesempatados = this.addRankingByWods(
          arrayAtletasEmpatados,
          masMejor,
          0
        );
    });
    return arrayDesempatados;
  }

  insertTieBreakAtletas(atletasDesempatdos, atletasArray) {
    console.log("rankeados", atletasArray);
    console.log("rankeadosSoloDesempatados", atletasDesempatdos);
    let arrayConRankingDesordenado = atletasArray.map(atleta => {
      let atletaToInsert;

      atletasDesempatdos.forEach(atletaDesempatado => {
        if (atleta.key === atletaDesempatado.key) {
          atletaToInsert = atletaDesempatado;
          return;
        }
      });
      console.log('atletaToInsert',atletaToInsert);
      
      if (!atletaToInsert) atletaToInsert = atleta;
      return atletaToInsert;
    });
    console.log("arrayConRankingDesordenado", arrayConRankingDesordenado);
    let arrayAtletasRankeado = arrayConRankingDesordenado.sort(
      (atletaAnterior, atletaActual) => {
        return atletaAnterior.wods.totalRanking < atletaActual.wods.totalRanking
          ? -1
          : 1;
      }
    );

    return arrayAtletasRankeado;
  }

  orderByTime(atletasArray, menosMejor) {
    // FALTA QUE LOS ORDENAR MAS MEJOR Y MENOS MEJOR ESTEN ACORDE CON EL .time de dataScores

    let atletas = _.cloneDeep(atletasArray);
    let atletasPorDebajoDelTiempo = [];
    let atletasSobrepasandoTiempo = [];

    atletas.forEach(atleta => {
      let atletaDataScore =
        atleta.wods.wodsArray[atleta.wods.wodsArray.length - 1].dataScore;
      if (atletaDataScore.time > atletaDataScore.maxTime) {
        atletasSobrepasandoTiempo.push(atleta);
      } else {
        atletasPorDebajoDelTiempo.push(atleta);
      }
    });

    // RANKEAR 1º atletasPorDebajoDelTiempo
    atletasPorDebajoDelTiempo = this.addRankingByWods(
      atletasPorDebajoDelTiempo,
      menosMejor,
      0
    );
    console.log(atletasPorDebajoDelTiempo);

    // RANKEAR 2º atletasSobrepasandoTiempo (y siguiendo el puesto numerico que hayan dejado los atletasPorDebajoDelTiempo)
    atletasSobrepasandoTiempo = this.addRankingByWods(
      atletasSobrepasandoTiempo,
      menosMejor,
      atletasPorDebajoDelTiempo.length
    );
    // CONCATENAR RANKEADOS
    let atletasOrdenados = _.flatten([
      atletasPorDebajoDelTiempo,
      atletasSobrepasandoTiempo
    ]);
    console.log("atletasOrdenados", atletasOrdenados);

    return atletasOrdenados;
  }

  getAtletasTieArray(atletasArrayOriginal) {
    let atletasArray = _.cloneDeep(atletasArrayOriginal);
    let atletasTieArray = [];

    // Recorremos el array en busca de atletas empatados
    let indexPivote = 0;
    while (indexPivote < atletasArray.length) {
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

  getTypeSortOfLastWod(atleta) {
    let wodArr = atleta.wods.wodsArray;
    return wodArr[wodArr.length - 1].type;
  }
}
