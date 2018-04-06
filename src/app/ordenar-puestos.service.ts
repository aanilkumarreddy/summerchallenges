import { Injectable } from "@angular/core";
import { AtletasService } from "./atletas/atletas.service";
import { filter } from "rxjs/operator/filter";
import * as _ from "lodash";

@Injectable()
export class OrdenarPuestosService {
  public atletas;
  public aux_atletas;
  public KEY_SUPERFALSA = 0;

  constructor(private atletasService: AtletasService) {
    let atletasPrueba = [
      this.createMockAtletaWod(26, "asc", 170, 100, 99),
      this.createMockAtletaWod(26, "asc", 180, 100, 101),
      this.createMockAtletaWod(25, "asc", 170, 100, 40),
      this.createMockAtletaWod(22, "asc", 120, 100, 59),
      this.createMockAtletaWod(15, "asc", 120, 100, 94),
      this.createMockAtletaWod(22, "asc", 126, 100, 70),
      this.createMockAtletaWod(22, "asc", 122, 100, 69),
      this.createMockAtletaWod(22, "asc", 125, 100, 69),
      this.createMockAtletaWod(22, "asc", 128, 100, 69),
      this.createMockAtletaWod(22, "asc", 120, 100, 12),
      this.createMockAtletaWod(10, "asc", 120, 100, 11),
      this.createMockAtletaWod(25, "asc", 130, 100, 110),
      this.createMockAtletaWod(19, "asc", 120, 100, 103),
      this.createMockAtletaWod(12, "asc", 120, 100, 105),
      this.createMockAtletaWod(10, "asc", 150, 100, 114),
      this.createMockAtletaWod(8, "asc", 8, 100, 101)
    ];

    let pruebaHard = atletasPrueba;
    let wodArray = atletasPrueba[0].wods.wodsArray;
    wodArray.forEach((atleta,indexWod)=>{
      pruebaHard = this.orderScoreByWods(pruebaHard, indexWod);
    })
    console.log("pruebaHard", pruebaHard);
    let rankeados = this.getAtletasRankeados(pruebaHard);
    console.log("rankeados", rankeados);


    this.getPayedAtletas();
  }
  // ____________________________________: Main Functions :___________________________________ //
  getPayedAtletas() {
    this.atletas = new Promise((resolve, reject) => {
      let atletasSubscribe = this.atletasService
        .getAtletas()
        .subscribe((data: any) => {
          let atletas = data.filter(atleta => atleta.estado === 5);
          resolve(atletas);
          atletasSubscribe.unsubscribe();
        });
    });
  }

  getWodOrdenado(id_categoria, wodName) {
    this.atletas.then(atletas => {
      // let atletasByCategory = atletas
      //   .filter(atleta => atleta)
      //   .filter(atleta => atleta.id_categoria === id_categoria);
      // let indexWod = atletasByCategory[0].wods.wodsArray.findIndex(
      //   wod => wod.name === wodName
      // );
      // this.addRankingByWOD(atletasByCategory, indexWod);
    });
  }

  getClasificacionFinal(id_categoria) {
    // let rankeadosDefinitivos = this.calculateTotalScore(id_categoria);
    // return rankeadosDefinitivos;
  }

  // ____________________________________: Aux Functions :___________________________________ //

  // CREAMOS WODS FALSOS PARA HACER LAS PRUEBAS
  createMockAtletaWod(totalscore, type, subScore, maxTime?, time?) {
    this.KEY_SUPERFALSA++;
    return {
      id_cateogoria: 1,
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
          },
          
          // ...
        ]
      },
      key: this.KEY_SUPERFALSA
    };
  }
  ç;
  // ///////////////////////////////////////////////

  orderScoreByWods(atletasArray, indexWod) {
    let atelatasOrdenadosSinRankear = this.orderByWodType(
      atletasArray,
      indexWod
    );

    let atletasRankeados = this.applyRankingWod(
      atelatasOrdenadosSinRankear,
      indexWod
    );

    return atletasRankeados;
  }

  orderByWodType(atletasArray, indexWod) {
    let typeSort = atletasArray[0].wods.wodsArray[indexWod].type;
    let atelatasOrdenadosSinRankear;
    if (typeSort === "desc") {
      atelatasOrdenadosSinRankear = this.ordenarDesc(atletasArray, indexWod);
    }
    if (typeSort === "asc") {
      atelatasOrdenadosSinRankear = this.ordenarAsc(atletasArray, indexWod);
    }
    return atelatasOrdenadosSinRankear;
  }

  ordenarDesc(atletasArray, indexWod) {
    let atelatasOrdenadosPorMasMejor = atletasArray.sort(
      (atletaAnterior, atletaActual) => {
        return atletaAnterior.wods.wodsArray[indexWod].score <
          atletaActual.wods.wodsArray[indexWod].score
          ? 1
          : -1;
      }
    );
    return atelatasOrdenadosPorMasMejor;
  }

  ordenarAsc(atletasArray, indexWod) {
    let atletas = _.cloneDeep(atletasArray);
    let atletasPorDebajoDelTiempo = [];
    let atletasSobrepasandoTiempo = [];

    atletas.forEach(atleta => {
      let atletaDataScore = atleta.wods.wodsArray[indexWod].dataScore;
      if (atletaDataScore.time > atletaDataScore.maxTime) {
        atletasSobrepasandoTiempo.push(atleta);
      } else {
        atletasPorDebajoDelTiempo.push(atleta);
      }
    });

    let atletasPorDebajoDelTiempoOrdenados = this.ordenarPorTiempo(
      atletasPorDebajoDelTiempo,
      indexWod
    );
    let atletasSobrepasandoTiempoOrdenados = this.ordenarDesc(
      atletasSobrepasandoTiempo,
      indexWod
    );

    let atletasOrdenados = _.flatten([
      atletasPorDebajoDelTiempoOrdenados,
      atletasSobrepasandoTiempoOrdenados
    ]);
    return atletasOrdenados;
  }

  ordenarPorTiempo(atletasArray, indexWod) {
    let atletasPorDebajoDelTiempo = atletasArray.sort(
      (atletaAnterior, atletaActual) => {
        return atletaAnterior.wods.wodsArray[indexWod].dataScore.time <
          atletaActual.wods.wodsArray[indexWod].dataScore.time
          ? -1
          : 1;
      }
    );
    return atletasPorDebajoDelTiempo;
  }

  // --------------- ranking
  applyRankingWod(atelatasOrdenadosSinRankear, indexWod) {
    let ranking = 0;
    atelatasOrdenadosSinRankear.forEach((atleta, index, atletasArr) => {
      // Si no hay puntuacion
      if (!atleta.wods.wodsArray[indexWod].score) {
        atleta.wods.wodsArray[indexWod].ranking = 99;
        return;
      }

      ranking++;

      // Si index cero
      if (!index) {
        atleta.wods.wodsArray[indexWod].ranking = ranking;
        return;
      }

      // Si empate
      let atletaAnteriorScore =
        atletasArr[index - 1].wods.wodsArray[indexWod].score;
      let atletaActualScore = atleta.wods.wodsArray[indexWod].score;
      let isEmpateScore = atletaActualScore === atletaAnteriorScore;

      let atletaAnteriorTime =
        atletasArr[index - 1].wods.wodsArray[indexWod].dataScore.time;
      let atletaActualTime = atleta.wods.wodsArray[indexWod].dataScore.time;
      let isEmpateTime = atletaAnteriorTime === atletaActualTime;
      

      if (isEmpateScore || isEmpateTime) {
        atleta.wods.wodsArray[indexWod].ranking =
          atletasArr[index - 1].wods.wodsArray[indexWod].ranking;
      } else {
        // Normal
        atleta.wods.wodsArray[indexWod].ranking = ranking;
      }
    });

    let wodAtletasRankeado = atelatasOrdenadosSinRankear.sort(
      (atletaAnterior, atletaActual) =>
        atletaAnterior.wods.wodsArray[indexWod].ranking >
        atletaActual.wods.wodsArray[indexWod].ranking
          ? 1
          : -1
    );

    wodAtletasRankeado.forEach(atleta => {
      if (atleta.wods.wodsArray[indexWod].ranking == 99) {
        atleta.wods.wodsArray[indexWod].ranking = "-";
      }
    });
    return wodAtletasRankeado;
  }

  // ____________________________: get Atletas Rankeados :__________________________________ //

  getAtletasRankeados(atletas) {
    let atletasParaRankear = _.cloneDeep(atletas);
    let atletasConTotalRanking = this.getTotalRankingOfWods(atletasParaRankear);
    let atletasOrdenados = this.ordenarAtletasConTotalRanking(atletasConTotalRanking);
    let atletasRankeados = this.applyRankig(atletasOrdenados);
    let arrayAtletasEmpatados = this.tieBreakScore(atletasRankeados);
    let atletasRankeadosDefinitivo = this.insertTieBreakAtletas(arrayAtletasEmpatados,atletasRankeados);
    console.log("atletasConTotalRanking", atletasOrdenados);
    console.log("atletasOrdenados", atletasOrdenados);
    console.log("atletasRankeados", atletasRankeados);
    console.log("arrayAtletasEmpatados", arrayAtletasEmpatados);
    console.log("atletasRankeadosDefinitivo", atletasRankeadosDefinitivo);
    // return atletasRankeadosDefinitivo;
  }

  getTotalRankingOfWods(atletasParaRankear) {
    let numWods = atletasParaRankear[0].wods.wodsArray.length;
    atletasParaRankear.forEach(atleta => {
      if(numWods<2) atleta.wods.totalRanking = atleta.wods.wodsArray[0].ranking;
      else{
        atleta.wods.totalRanking = atleta.wods.wodsArray.reduce(
          (wodAnterior, wodActual) => wodActual.ranking + wodAnterior.ranking
        );
      }
    });
    return atletasParaRankear;
  }

  ordenarAtletasConTotalRanking(atletasArray) {
    let atletasConTotalRanking = atletasArray.sort(
      (atletaAnterior, atletaActual) => {
        return atletaAnterior.wods.totalRanking < atletaActual.wods.totalRanking
          ? -1
          : 1;
      }
    );
    return atletasConTotalRanking;
  }

  applyRankig(atletasArray) {
    let atletas = _.cloneDeep(atletasArray);
    let ranking = 1;
    
    let atletasByCategoryApplyRanking = atletasArray.map(
      (atleta, index, self) => {
        if (index === 0) {
          atletas[index].wods.totalRanking = ranking;
        } else {
          if (atleta.wods.totalRanking === self[index - 1].wods.totalRanking) {
            atletas[index].wods.totalRanking =
              atletas[index - 1].wods.totalRanking;
          } else {
            atletas[index].wods.totalRanking = ranking;
          }
        }
        ranking++;
        return atletas[index];
      }
    );
    
    return atletas;
  }

  tieBreakScore(atletasArray) {
    // Obtenemos un array de arrays donde cada subArray son los atletas empatados entre si
    let atletasTieArray = this.getAtletasTieArray(atletasArray);
    console.log('atletasTieArray',atletasTieArray);
    
    let lastIndexOfWods = atletasArray[0].wods.wodsArray.length -1;
    let arrayDeArrayDesmepatadosSinRankear = [];
    atletasTieArray.forEach(arrayEmpatados => {
      let arrayDesempatadosSinRankear  = this.orderByWodType(arrayEmpatados,lastIndexOfWods);
      arrayDeArrayDesmepatadosSinRankear.push(arrayDesempatadosSinRankear);
    })

    let arrayEmpatadosRankeados = [];
    arrayDeArrayDesmepatadosSinRankear.forEach(atletasEmpatados => {
      arrayEmpatadosRankeados.push(atletasEmpatados.map((atleta,index,self) => {
        console.log('/////////',atleta.wods.totalRanking);
        if(index!==0){
          let timeAtletaActual = atleta.wods.wodsArray[atleta.wods.wodsArray.length-1].dataScore.time;
          let timeAtletaAnterior = self[index-1].wods.wodsArray[atleta.wods.wodsArray.length-1].dataScore.time;
          let totalRankingAtletaActual = atleta.wods.totalRanking;
          let totalRankingAtletaAnterior = self[index-1].wods.totalRanking;
          if(timeAtletaActual === timeAtletaAnterior) return atleta;
        }
        
        atleta.wods.totalRanking += index;
        return atleta;
      }))
    })
    arrayEmpatadosRankeados = _.flatten(arrayEmpatadosRankeados);
    return arrayEmpatadosRankeados;
  }

  
  orderByTotalRanking(atletasArray, indexWod) {
    let typeSort = atletasArray[0].wods.wodsArray[indexWod].type;
    let atelatasOrdenadosSinRankear;
    if (typeSort === "desc") {
      atelatasOrdenadosSinRankear = this.ordenarDesc(atletasArray, indexWod);
    }
    if (typeSort === "asc") {
      atelatasOrdenadosSinRankear = this.ordenarAsc(atletasArray, indexWod);
    }
    return atelatasOrdenadosSinRankear;
  }

  insertTieBreakAtletas(atletasDesempatdos, atletasArray) {
      let arrayConRankingDesordenado = atletasArray.map(atleta => {
        let atletaToInsert;
  
        _.flatten(atletasDesempatdos).forEach((atletaDesempatado: any) => {
          if (atleta.key === atletaDesempatado.key) {
            atletaToInsert = atletaDesempatado;
            return;
          }
        });
  
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
  








  // calculateTotalScore(id_cateogoria) {
  //   // [TODO] -> descomentar luego
  //   let atletasByCategory = this.atletas
  //     .filter(atleta => atleta)
  //     .filter(atleta => atleta.id_categoria === id_cateogoria);

  //   // Finalmente extraemos scores totales y luego desempatamos

  //   // [TODO] -> descomentar!!! OJO ********************************************************************************

  //   // atletasByCategory.forEach(atleta => {
  //   //   atleta.totalScore = atleta.wods.wodsArray.reduce(
  //   //     (wodAnterior, wodActual) => wodActual.score + wodAnterior.score
  //   //   );
  //   // });

  //   // atletasByCategory.forEach(atleta => {
  //   //   atleta.totalRanking = atleta.wods.wodsArray.reduce(
  //   //     (wodAnterior, wodActual) => wodActual.ranking + wodAnterior.ranking
  //   //   );
  //   // });

  //   // PRUEBAS MOCKS
  //   let atletasPrueba = [
  //     this.createMockAtletaWod(26, "asc", 170, 100, 5),
  //     this.createMockAtletaWod(26, "asc", 180, 100, 99),
  //     this.createMockAtletaWod(25, "asc", 170, 100, 40),
  //     this.createMockAtletaWod(22, "asc", 120, 100, 59),
  //     this.createMockAtletaWod(15, "asc", 120, 100, 94),
  //     this.createMockAtletaWod(22, "asc", 126, 100, 70),
  //     this.createMockAtletaWod(22, "asc", 122, 100, 69),
  //     this.createMockAtletaWod(22, "asc", 125, 100, 90),
  //     this.createMockAtletaWod(22, "asc", 128, 100, 10),
  //     this.createMockAtletaWod(22, "asc", 119, 100, 44),
  //     this.createMockAtletaWod(10, "asc", 120, 100, 32),
  //     this.createMockAtletaWod(25, "asc", 130, 100, 92),
  //     this.createMockAtletaWod(19, "asc", 120, 100, 20),
  //     this.createMockAtletaWod(12, "asc", 120, 100, 17),
  //     this.createMockAtletaWod(10, "asc", 150, 100, 1),
  //     this.createMockAtletaWod(18, "asc", 120, 100, 2)
  //   ];
  //   let filtroWod = this.addRankingByWOD(atletasPrueba, 0);
  //   console.log("filtroWod", filtroWod);

  //   let atletasOrdenadosPorTotalScore = this.orderByTotalScore(atletasPrueba);

  //   let rankeados = this.addRankig(atletasOrdenadosPorTotalScore);

  //   let rankeadosSoloDesempatados = this.tieBreakScore(rankeados);

  //   let rankeadosDefinitivos = this.insertTieBreakAtletas(
  //     rankeadosSoloDesempatados,
  //     rankeados
  //   );

  //   return rankeadosDefinitivos;
  // }

  // addRankig(atletasByCategoryOrdenado) {
  //   let ranking = 1;
  //   let atletasByCategoryApplyRanking = atletasByCategoryOrdenado.map(
  //     (atleta, index, self) => {
  //       if (index === 0) {
  //         atleta.wods.totalRanking = atleta.wods.totalRanking + ranking;
  //       } else {
  //         if (atleta.wods.totalScore === self[index - 1].wods.totalScore) {
  //           atleta.wods.totalRanking = self[index - 1].wods.totalRanking;
  //         } else {
  //           atleta.wods.totalRanking = atleta.wods.totalRanking + ranking;
  //         }
  //       }
  //       ranking++;
  //       return atleta;
  //     }
  //   );
  //   return atletasByCategoryApplyRanking;
  // }

  // addRankingByWods(arrayAtletasEmpatados, ordenar, ranking) {
  //   return arrayAtletasEmpatados.sort(ordenar).map((atleta, index, self) => {
  //     if (index === 0) {
  //       atleta.wods.totalRanking = atleta.wods.totalRanking + ranking;
  //       ranking++;
  //       return atleta;
  //     }

  //     let rankingAtletaActual =
  //       atleta.wods.wodsArray[atleta.wods.wodsArray.length - 1].ranking;
  //     let rankingAtletaAnterior =
  //       self[index - 1].wods.wodsArray[
  //         self[index - 1].wods.wodsArray.length - 1
  //       ].ranking;

  //     if (rankingAtletaActual === rankingAtletaAnterior) {
  //       atleta.wods.totalRanking = self[index - 1].wods.totalRanking;
  //       ranking++;
  //       return atleta;
  //     } else {
  //       atleta.wods.totalRanking = atleta.wods.totalRanking + ranking;
  //       ranking++;
  //       return atleta;
  //     }
  //   });
  // }

  // addRankingByWOD(atletasArray, indexWod) {
  //   let ordenar;
  //   let arrayOrdenado = [];
  //   let masMejor = (atlAnterior, atlActual) => {
  //     return atlAnterior.wods.wodsArray[indexWod].score <
  //       atlActual.wods.wodsArray[indexWod].score
  //       ? -1
  //       : 1;
  //   };
  //   let menosMejorSiTime = (atletaAnterior, atletaActual) =>
  //     atletaAnterior.wods.wodsArray[atletaAnterior.wods.wodsArray.length - 1]
  //       .dataScore.time <
  //     atletaActual.wods.wodsArray[atletaActual.wods.wodsArray.length - 1]
  //       .dataScore.time
  //       ? -1
  //       : 1;

  //   let typeWod = atletasArray[0].wods.wodsArray[indexWod].type;
  //   if (typeWod === "desc") {
  //     ordenar = masMejor;
  //     arrayOrdenado = atletasArray.sort(ordenar);
  //   } else if (typeWod === "asc") {
  //     // alert();
  //     // return this.orderByTime(atletasArray, menosMejorSiTime, masMejor);
  //   }

  //   let ranking = 1;
  //   return arrayOrdenado.map((atleta, index, self) => {
  //     if (index === 0) {
  //       atleta.wods.wodsArray[indexWod].ranking = ranking;
  //       ranking++;
  //       return atleta;
  //     }

  //     let scoreAtletaActual = atleta.wods.wodsArray[indexWod].score;
  //     let scoreAtletaAnterior = self[index - 1].wods.wodsArray[indexWod].score;

  //     if (scoreAtletaActual === scoreAtletaAnterior) {
  //       atleta.wods.wodsArray[indexWod].ranking =
  //         self[index - 1].wods.wodsArray[indexWod].ranking;
  //       ranking++;
  //       return atleta;
  //     } else {
  //       atleta.wods.wodsArray[indexWod].ranking = ranking;
  //       ranking++;
  //       return atleta;
  //     }
  //   });
  // }

  // orderByTotalScore(atletasArray) {
  //   let orden = (atletaAnterior, atletaActual) =>
  //     atletaAnterior.wods.totalScore < atletaActual.wods.totalScore ? 1 : -1;
  //   return atletasArray.sort(orden);
  // }

  

  // 
  // orderByTime(atletasArray, menosMejor, masMejor) {
  //   let atletas = _.cloneDeep(atletasArray);
  //   let atletasPorDebajoDelTiempo = [];
  //   let atletasSobrepasandoTiempo = [];

  //   atletas.forEach(atleta => {
  //     let atletaDataScore =
  //       atleta.wods.wodsArray[atleta.wods.wodsArray.length - 1].dataScore;
  //     if (atletaDataScore.time > atletaDataScore.maxTime) {
  //       atletasSobrepasandoTiempo.push(atleta);
  //     } else {
  //       atletasPorDebajoDelTiempo.push(atleta);
  //     }
  //   });

  //   // RANKEAR 1º atletasPorDebajoDelTiempo
  //   atletasPorDebajoDelTiempo = this.addRankingByWods(
  //     atletasPorDebajoDelTiempo,
  //     menosMejor,
  //     0
  //   );

  //   // RANKEAR 2º atletasSobrepasandoTiempo (y siguiendo el puesto numerico que hayan dejado los atletasPorDebajoDelTiempo)
  //   let indexRanking = atletasPorDebajoDelTiempo.length;
  //   if (!indexRanking) indexRanking = 0;

  //   atletasSobrepasandoTiempo = this.addRankingByWods(
  //     atletasSobrepasandoTiempo,
  //     masMejor,
  //     indexRanking
  //   );

  //   // CONCATENAR RANKEADOS
  //   let atletasOrdenados = _.flatten([
  //     atletasPorDebajoDelTiempo,
  //     atletasSobrepasandoTiempo
  //   ]);
  //   console.log("atletasOrdenadosPorTiempo", atletasOrdenados);

  //   return atletasOrdenados;
  // }

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
          atletaPivote.wods.totalRanking === atleta.wods.totalRanking &&
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
          atleta => atleta.wods.totalRanking !== atletaPivote.wods.totalRanking
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
