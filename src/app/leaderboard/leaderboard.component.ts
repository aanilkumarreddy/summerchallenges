import { Component, OnInit } from "@angular/core";
import { Router, RouterModule, ActivatedRoute } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { AngularFire, FirebaseListObservable } from "angularfire2";
import { AuthCorreo } from "../auth/auth";
import { Atleta } from "../atleta/atleta";
import { AtletasService } from "../atletas/atletas.service";
import { CategoriasService } from "../categorias/categorias.service";
import { WodsService } from "../wods/wods.service";
import { OrdenarPuestosService } from "../ordenar-puestos.service";

@Component({
  selector: "app-leaderboard",
  templateUrl: "./leaderboard.component.html",
  styleUrls: ["./leaderboard.component.css"]
})
export class LeaderboardComponent implements OnInit {
  private auth: any;
  public key: any;
  public atleta: any;
  public categoria: any;
  public estado: boolean;
  public atletas: any;
  public id_categoria: number;
  public aux_categoria;
  public seleccion;
  public categorias;
  public wods_actuales;

  constructor(
    private authService: AuthService,
    private af: AngularFire,
    private router: Router,
    private route: ActivatedRoute,
    private atletasService: AtletasService,
    private categoriasService: CategoriasService,
    private wodsService: WodsService,
    private ordenarPuesto: OrdenarPuestosService
  ) {
    this.af.auth.subscribe(data => {
      this.categoriasService.getCategorias().subscribe(data => {
        this.categorias = data;

        /* Eliminamos la categoría Amateur */
        //this.categorias.pop();
        this.getClasificacion("final", 1);
        /*setTimeout(() => {
          //this.getAtletas_byCategoria(1);
          this.getClasificacion("wod", 1, "WOD 1", 0);
        }, 400);*/
      })
      if (data) {
        this.auth = data.auth;
        // if(this.auth.email != 'info@gcsummerchallenge.com') {
        //   this.router.navigate(['/login']);
        // }
        let aux_atletas = this.atletasService.getAtleta_byEmail(this.auth.email);
        aux_atletas.subscribe((atleta: any) => {
          this.atleta = atleta[0];
          this.key = atleta.$key;
          this.categoria = this.atleta.id_categoria;

          this.atletasService.getAtletas().subscribe(atletas => {
            // this.atletas = atletas;
            // Aquí ya tendríamos todos los atletas, a falta de filtrarlos
            //this.getAtletas_byCategoria(this.categoria);
          });
        });

        /*
        * Inicializa los wods de los atletas que aún no tengan datos introducidos
        */


        /*
        * Wods de test para comprobar la funcionalidad TODO: BORRAR
        */
        const wod_1_init = {
          kilos: 50,
          reps: 10,
          puesto: "",
          puntuacion: 500,
          url: 'https://youtube.com'
        };
        const wod_2_init = {
          tiempo: "00:00",
          reps: 0,
          puesto: "",
          puntuacion: 0,
          url: 'https://youtube.com'
        };
        // Actualiza WOD 1 (KEY, WOD) -
        // this.wodsService.update_wod1('-L4RtFZOBTe7JwU3yr8W', wod_1_init);
        // Actualiza WOD 2 (KEY, WOD) -
        //this.wodsService.update_wod2('-L4a9Ekj6Y40JQwhovvr', wod_2_init);

      } else {
        // Código de redirección a login .
        // No hay datos en auth, no está logueado.
        //this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit() {
  }
  animateAtletasCard() {
    setTimeout(() => {
      const cardsAtletas = Array.from(document.querySelectorAll('.atleta-card'));
      let timer = 100;
      cardsAtletas.forEach(card => {
        timer += 100;
        setTimeout(() => {
          card.classList.add('fadeIn');
          card.classList.add('display');
        }, timer)
      })
      //this.seleccion = 'general';
    }, 50)
  }
  getClasificacion(type, id_categoria, nombre_wod?, index_wod?) {


    if (type == "final") {
      this.ordenarPuesto.getClasificacionFinal(id_categoria)
        .subscribe(data => {
          this.atletas = data;
          //this.getAtletas_byCategoria(1);
          this.wods_actuales = data[0].wods.wodsArray;

          this.atletas.forEach(atleta => {
            let ranking = 0;
            atleta.wods.wodsArray.forEach(wod => {
              ranking += parseFloat(wod.ranking)
            })
            atleta.wods.totalRanking = ranking;
            console.log(typeof atleta.wods.totalRanking);
            if (isNaN(atleta.wods.totalRanking)) atleta.wods.totalRanking = "-";
            console.log(ranking);
          })
          this.atletas.sort((a, b) => a.wods.totalRanking - b.wods.totalRanking);
          this.animateAtletasCard();
          this.seleccion = 'general';
        })
    }

    if (type == "wod") {
      this.ordenarPuesto.getWodOrdenado(id_categoria, nombre_wod)
        .subscribe(data => {
          this.atletas = data;
          //this.getAtletas_byCategoria(1);
          this.wods_actuales = data[0].wods.wodsArray;
          this.animateAtletasCard();
          this.seleccion = index_wod;
        })
    }

    this.categorias.forEach(cat => {
      if (cat.c_id == id_categoria) {
        cat.estado = "on";
        this.categoria = cat;
      } else {
        cat.estado = "";
      }
    })
  }

  getAtletas_byCategoria(id_categoria) {
    let _atletas = this.atletasService.getAtletas_byCategoria(id_categoria);
    _atletas.subscribe(data => {
      this.atletas = data.filter(
        // TODO: MODIFICAR ESTO
        atleta => atleta.estado > 1 && atleta.id_categoria == id_categoria
        //Aquí se pueden añadir más filtros
      );
      this.atletas.forEach((atleta, index) => {
        let numero = atleta.id_categoria;

        index < 10 ? numero += "0" + index : numero += "" + index;
      })
      this.animateAtletasCard();

      this.orderBy_total();


    });

    this.categorias.forEach(cat => {
      if (cat.c_id == id_categoria) {
        cat.estado = "on";
        this.categoria = cat;
      } else {
        cat.estado = "";
      }
    })
  }

  orderBy_inscritos() {
    this.atletasService.getAtletas().subscribe(data => {
      this.atletas = data;
    })
  }

  orderBy_wod2() {
    // Ordernar por wod_2
    this.atletas.forEach(atleta => {
      atleta.wod_1b.puntuacion = parseInt(atleta.wod_1b.puntuacion);
    });

    this.atletas.sort(
      (a, b) => (a.wod_1b.puntuacion < b.wod_1b.puntuacion ? 1 : -1)
    );

    let kk = 0;
    this.atletas.forEach(atleta => {
      if (atleta.wod_1b.puntuacion != 0) {
        kk++;
        atleta.wod_1b.puesto = kk;
      } else {
        atleta.wod_1b.puesto = 99;
      }
    });
    this.atletas.sort((a, b) => (a.wod_1b.puesto > b.wod_1b.puesto ? 1 : -1));

    this.atletas.forEach(atleta => {
      if (atleta.wod_1b.puesto == 99) {
        atleta.wod_1b.puesto = "-";
      }
    });
    /*
    this.seleccion = 'wod1b';
    let label = document.querySelector('#wod1b');
    this.resetLabels();
    label.classList.add('active');
    */
  }
  resetLabels() {
    let labelsContainer = document.querySelector('.active-categoria');
    let labels = Array.from(labelsContainer.querySelectorAll('label'));

    labels.forEach(label => { label.classList.remove('active') });
  }

  orderBy_wod1() {
    this.atletas.forEach(atleta => {
      if (atleta.wod_1a && atleta.wod_1a.kilos != 0) {
      }
      atleta.wod_1a.puntuacion = parseInt(atleta.wod_1a.puntuacion);
    });
    this.atletas.sort(
      (a, b) => (a.wod_1a.puntuacion < b.wod_1a.puntuacion ? 1 : -1)
    );

    let kk = 0;
    this.atletas.forEach(atleta => {
      if (atleta.wod_1a.puntuacion != 0) {
        kk++;
        atleta.wod_1a.puesto = kk;
      } else {
        atleta.wod_1a.puesto = 99;
      }
    });
    this.atletas.sort((a, b) => (a.wod_1a.puesto > b.wod_1a.puesto ? 1 : -1));

    this.atletas.forEach(atleta => {
      if (atleta.wod_1a.puesto == 99) {
        atleta.wod_1a.puesto = "-";
      }
    });
    /*
    this.seleccion = "wod1a";
    let label = document.querySelector('#wod1a');
    this.resetLabels();
    label.classList.add('active');
    */
  }

  orderBy_total() {
    this.orderBy_wod1();
    this.orderBy_wod2();


    this.atletas.forEach(atleta => {
      if (atleta.wod_1a.puntuacion != 0 && atleta.wod_1b.puntuacion != 0) {
        atleta.puntos = atleta.wod_1a.puesto + atleta.wod_1b.puesto;
      } else if (atleta.wod_1a.puntuacion != 0 || atleta.wod_1b.puntuacion != 0) {
        atleta.puntos = 98;
      } else {
        atleta.puntos = 99;
      }
    });

    this.atletas.sort((a, b) => (a.puntos > b.puntos ? 1 : -1));

    this.atletas.forEach(atleta => {
      if (atleta.puntos == 99 || atleta.puntos == 98) {
        atleta.puntos = "-";
      }
    });
    this.seleccion = 'general';
    let label = document.querySelector('#general');
    this.resetLabels();
    label.classList.add('active');
  }

}
