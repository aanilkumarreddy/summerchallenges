import { Injectable } from "@angular/core";
import { AtletasService } from "./atletas/atletas.service";
import { filter } from "rxjs/operator/filter";
import * as _ from "lodash";

@Injectable()
export class OrdenarPuestosService {
  public atletas;
  public aux_atletas;
  public KEY_SUPERFALSA = 0;
  public atletasPrueba = [
    this.createMockAtletaWod(26, "asc", 170, 100, 44),
    this.createMockAtletaWod(26, "asc", 150, 100, 101),
    this.createMockAtletaWod(26, "asc", 50, 100, 102),
    this.createMockAtletaWod(25, "asc", 60, 100, 40),
    this.createMockAtletaWod(25, "asc", 10, 100, 40),
    this.createMockAtletaWod(25, "asc", 10, 100, 40),
    // this.createMockAtletaWod(22, "asc", 120, 100, 59),
    // this.createMockAtletaWod(15, "asc", 120, 100, 94),
    // this.createMockAtletaWod(22, "asc", 126, 100, 70),
    // this.createMockAtletaWod(22, "asc", 122, 100, 69),
    // this.createMockAtletaWod(22, "asc", 125, 100, 69),
    // this.createMockAtletaWod(22, "asc", 128, 100, 69),
    // this.createMockAtletaWod(22, "asc", 120, 100, 12),
    
    // this.createMockAtletaWod(10, "asc", 120, 100, 11),
    // this.createMockAtletaWod(25, "asc", 130, 100, 110),
    // this.createMockAtletaWod(19, "asc", 120, 100, 103),
    // this.createMockAtletaWod(12, "asc", 120, 100, 105),
    // this.createMockAtletaWod(10, "asc", 150, 100, 114),
    // this.createMockAtletaWod(8, "asc", 8, 100, 101)
  ];

  constructor(private atletasService: AtletasService) {
    this.getPayedAtletas();
    /*
    this.getClasificacionFinal(1).then(res => console.log('rankeados def', res));
    this.getWodOrdenado(1, "WOD 1").then(res => console.log('rankeados wod', res));
    */
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
    return this.atletas.then(atletas => {

      // atletas = this.atletasPrueba; // [TODO] -> ELIMINAR ESTO PARA PRUEBAS REALES

      let atletasByCategoria = atletas.filter(atleta => atleta.id_categoria === id_categoria);
      let indexWod = atletas[0].wods.wodsArray.findIndex(wod => wod.name = wodName);

      let wodRankeado = this.orderScoreByWods(atletasByCategoria, indexWod);

      return wodRankeado;
    });
  }

  getClasificacionFinal(id_categoria) {
    return this.atletas.then(atletas => {

      // atletas = this.atletasPrueba; // [TODO] -> ELIMINAR ESTO PARA PRUEBAS REALES
      // OJO CON LA KEY SUPERFALSA
      // OJO CON LA KEY SUPERFALSA
      // OJO CON LA KEY SUPERFALSA
      // OJO CON LA KEY SUPERFALSA
      // OJO CON LA KEY SUPERFALSA

      let atletasAñadiendoCambios = atletas.filter(atleta => atleta.id_categoria === id_categoria);
      // let indexWod = atletasAñadiendoCambios[0].wods.wodsArray.findIndex(wod => wod.name = wodName);
      let wodArray = atletasAñadiendoCambios[0].wods.wodsArray;
      let indexWodLimit = this.ultimoWodRellenado(atletasAñadiendoCambios,wodArray);      
      
      wodArray = atletasAñadiendoCambios[0].wods.wodsArray.slice(0,indexWodLimit);
      
      wodArray.forEach((atleta,indexWod)=>{

        atletasAñadiendoCambios = this.orderScoreByWods(atletasAñadiendoCambios, indexWod);
      })
      let rankeados = this.getAtletasRankeados(atletasAñadiendoCambios);

      return rankeados;
    });

  }

  // ____________________________________: Aux Functions :___________________________________ //

  // CREAMOS WODS FALSOS PARA HACER LAS PRUEBAS
  createMockAtletaWod(totalscore, type, subScore, maxTime?, time?) {
    this.KEY_SUPERFALSA++;
    return {
      id_categoria: 1,
      key: this.KEY_SUPERFALSA,
      wods: {
        totalScore: totalscore,
        totalRanking: 0,
        wodsArray: [
          {
            type: type,
            name: "WOD 1",
            dataScore: {
              reps: 0,
              kilos: 0,
              time: time || 0,
              maxTime: maxTime || 0
            },
            score: subScore,
            ranking:0
          },
          {
            type: type,
            name: "WOD 2",
            dataScore: {
              reps: 0,
              kilos: 0,
              time: time || 0,
              maxTime: maxTime || 0
            },
            score:5,
            ranking:Math.floor(Math.random() * (10 - 1)) + 1
          },

          // ...
        ]
      },
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
      if (atletaDataScore.time >= atletaDataScore.maxTime) {
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

  ultimoWodRellenado(atletasAñadiendoCambios,wodArray){
    let indexWodLimit = 0;
      wodArray.forEach((wod,index)=>{
        let atletasConScore = atletasAñadiendoCambios.filter(atleta => atleta.wods.wodsArray[index].score).length;
        let porcentajeConScore = (atletasConScore/atletasAñadiendoCambios.length)*100;

        if(porcentajeConScore > 90) {
          indexWodLimit = index + 1;
        }else{
          return;
        }
      });
      return indexWodLimit;
  }
  
  getAtletasRankeados(atletas) {
    let atletasParaRankear = _.cloneDeep(atletas);
    let atletasConTotalRanking = this.getTotalRankingOfWods(atletasParaRankear);
    let atletasOrdenados = this.ordenarAtletasConTotalRanking(atletasConTotalRanking);
    let atletasRankeados = this.applyRankig(atletasOrdenados);
    let arrayAtletasEmpatados = this.tieBreakScore(atletasRankeados);
    let atletasRankeadosDefinitivo = this.insertTieBreakAtletas(arrayAtletasEmpatados, atletasRankeados);

    return atletasRankeadosDefinitivo;
  }

  getTotalRankingOfWods(atletasParaRankear) {
    let numWods = atletasParaRankear[0].wods.wodsArray.length;
    atletasParaRankear.forEach(atleta => {
      if (numWods < 2) atleta.wods.totalRanking = atleta.wods.wodsArray[0].ranking;
      else {
        atleta.wods.totalRanking = atleta.wods.wodsArray.reduce(
          (wodAnterior, wodActual) => {
            if(typeof wodActual.ranking !== 'number' || typeof wodAnterior.ranking !== 'number') return "-"
            return wodActual.ranking + wodAnterior.ranking
          }
        );
      }
    });
    
    return atletasParaRankear;
  }

  ordenarAtletasConTotalRanking(atletasArray) {
    let atletasConTotalRanking = atletasArray.filter(atleta => typeof atleta.wods.totalRanking === 'number').sort(
      (atletaAnterior, atletaActual) => {

        return atletaAnterior.wods.totalRanking < atletaActual.wods.totalRanking
          ? -1
          : 1;
      }
    );   
    let noClasificados = atletasArray.filter(atleta => typeof atleta.wods.totalRanking !== 'number');
    let arrayConRankingYNoClasificados = _.flatten([atletasConTotalRanking,noClasificados])
    return arrayConRankingYNoClasificados;
  }

  applyRankig(atletasArray) {
    let atletas = _.cloneDeep(atletasArray);
    let ranking = 1;

    console.log("con guion",atletas);
    
    let atletasByCategoryApplyRanking = atletasArray.map(
      (atleta, index, self) => {
        if (index === 0) {
          if(typeof atletas[index].wods.totalRanking !== 'number') {
            atletas[index].wods.totalRanking = "-";
          } else {
            atletas[index].wods.totalRanking = ranking;
          }
        } else {
          if (atleta.wods.totalRanking === self[index - 1].wods.totalRanking) {
            atletas[index].wods.totalRanking =
              atletas[index - 1].wods.totalRanking;
          } else if(typeof atletas[index].wods.totalRanking !== 'number') {
            atletas[index].wods.totalRanking = "-";
          } else {
            atletas[index].wods.totalRanking = ranking;
          }
        }
        ranking++;
        return atletas[index];
      }
    );

    // atletas.forEach(atleta => {
    //   if (atleta.wods.totalRanking == "-") {
    //     atleta.wods.totalRanking == 99
    //   }
    // });
    
    return atletas;
  }

  tieBreakScore(atletasArray) {
    // Obtenemos un array de arrays donde cada subArray son los atletas empatados entre si
    let atletasTieArray = this.getAtletasTieArray(atletasArray);

    let lastIndexOfWods = atletasArray[0].wods.wodsArray.length - 1;
    let arrayDeArrayDesmepatadosSinRankear = [];
    atletasTieArray.forEach(arrayEmpatados => {
      let arrayDesempatadosSinRankear = this.orderByWodType(arrayEmpatados, lastIndexOfWods);
      arrayDeArrayDesmepatadosSinRankear.push(arrayDesempatadosSinRankear);
    })

    let arrayEmpatadosRankeados = [];
    arrayDeArrayDesmepatadosSinRankear.forEach(atletasEmpatados => {
      arrayEmpatadosRankeados.push(atletasEmpatados.map((atleta, index, self) => {
        if (index !== 0) {
          let timeAtletaActual = atleta.wods.wodsArray[atleta.wods.wodsArray.length - 1].dataScore.time;
          let timeAtletaAnterior = self[index - 1].wods.wodsArray[atleta.wods.wodsArray.length - 1].dataScore.time;
          let isSameTime = timeAtletaActual === timeAtletaAnterior

          let scoreAtletaActual = atleta.wods.wodsArray[atleta.wods.wodsArray.length - 1].score;
          let scoreAtletaAnterior = self[index - 1].wods.wodsArray[atleta.wods.wodsArray.length - 1].score;
          let isSameScore = scoreAtletaActual === scoreAtletaAnterior
          if (isSameTime || isSameScore) return atleta;
        }
        if(typeof atleta.wods.totalRanking !== 'number') {
          atleta.wods.totalRanking = "-";
        }else{
          atleta.wods.totalRanking += index;
        }
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
          // if (atleta.key === atletaDesempatado.key) {
          if (atleta.$key === atletaDesempatado.$key) {
            atletaToInsert = atletaDesempatado;
            return;
          }
        });
  
        if (!atletaToInsert) atletaToInsert = atleta;
        return atletaToInsert;
      });
      console.log("arrayConRankingDesordenado", arrayConRankingDesordenado);
      let arrayAtletasRankeado = arrayConRankingDesordenado.filter(atleta => typeof atleta.wods.totalRanking === 'number').sort(
        (atletaAnterior, atletaActual) => {
          return atletaAnterior.wods.totalRanking < atletaActual.wods.totalRanking
            ? -1
            : 1;
        }
      );
      
      let noClasificados = atletasArray.filter(atleta => typeof atleta.wods.totalRanking !== 'number');
      let arrayConRankingYNoClasificados = _.flatten([arrayAtletasRankeado,noClasificados])
      return arrayConRankingYNoClasificados;
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
