import { Component, OnInit, Input } from "@angular/core";
import { Http } from "@angular/http/src/http";
import "rxjs/add/operator/toPromise";
import { DomSanitizer } from "@angular/platform-browser";
import { WodsService } from "../wods/wods.service";
import { DomAdapter } from "@angular/platform-browser/src/dom/dom_adapter";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AtletasService } from "../atletas/atletas.service";
import { AtletaService } from "../atleta/atleta.service";
import { AngularFire } from "angularfire2";
import { SafeResourceUrl } from "@angular/platform-browser/src/security/dom_sanitization_service";

interface IwodData {
  key: string;
  name: string;
  data: {
    kilos?: number;
    tiempo?: number;
    reps: number;
    puesto: any;
    puntuacion: number;
    url: string;
  };
}

@Component({
  selector: "app-wod-card",
  templateUrl: "./wod-card.component.html",
  styleUrls: ["./wod-card.component.css"]
})
export class WodCardComponent implements OnInit {
  @Input() wod: any;

  private wodData: IwodData;
  private formObject;
  private youtubeUrl: SafeResourceUrl;
  private videoUrlDone: boolean = false;
  private sendedScore: boolean = false;
  private errVideoUrl: boolean = false;
  private scoreForm: FormGroup;
  private auth;
  private atleta;
  private key;
  private trySendScore;

  private timeExpReg = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  private urlExpReg = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

  constructor(
    private wodsService: WodsService,
    private http: Http,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private atletasService: AtletasService,
    private af: AngularFire
  ) {
    this.authAtleta(af);
  }
  
  ngOnInit() {
    this.formConfig();
    console.log(this.wod.titulo);
  }

  selectWodType(typeWod) {
    // Aqui lo ideal sería meter un switch o llamada a servicio
    // Que gestionase cualquier tipo de wod con sus nombres estipulados
    // Y genere el form en consecuencia. Asi se tendría una solución general.

    this.formObject = {
      kilos: [null, Validators.required],
      reps: [null, Validators.required],
      time: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(this.timeExpReg)
        ])
      ],
      url: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(this.urlExpReg)
        ])
      ]
    };

    this.wodData = {
      key: "",
      name: typeWod.toLowerCase().replace(" ","_"),
      data: {
        kilos: 0,
        tiempo: 0,
        reps: 0,
        puesto: "",
        puntuacion: 0,
        url: ""
      }
    };

    if (typeWod == "WOD 1") {
      delete this.formObject.time;
      delete this.wodData.data.tiempo;
      console.log("wod1", this.formObject);
    }
    if (typeWod == "WOD 2") {
      delete this.formObject.kilos;
      delete this.wodData.data.kilos;
      console.log("wod2", this.formObject);    
    }
  }

  updateWod(post) {
    if (!this.scoreForm.valid) {
      this.trySendScore = true;
      this.checkVideoUrl(post.url);
      return;
    }

    this.checkVideoUrl(post.url, post => this.setWodScore(post));
  }

  setWodScore(post) {

    // Aqui tambien tendría que haber un switch
    // O un handler del servicio para que concuerde
    // La adquisicion de datos con el form correspondiente
    if (this.wod.titulo == "WOD 1") {
      this.wodData.data.kilos = parseFloat(post.kilos);
    }
    if (this.wod.titulo == "WOD 2") {
      this.wodData.data.tiempo = post.time;
    }

    this.wodData.data.reps = parseFloat(post.reps);
    this.wodData.data.url = post.url;

    this.wodsService.update_wod(this.wodData);
    this.sendedScore = true;
  }

  checkVideoUrl(url: string, fn?: any): void {
    if (!this.scoreForm.controls["url"].valid || !this.scoreForm.valid) return;

    this.http
      .get(url)
      .toPromise()
      .then(res => {
        this.checkUrlYoutube(url);
        fn();
        console.log("no error: ",  fn );    
        
      })
      .catch(err => {
        this.errVideoUrl = true;
        console.log("error chechVideoUrl: ",  this.errVideoUrl );    
      });
  }

  checkUrlYoutube(url: string): void {
    let part = url.split("/");
    part = part[part.length - 1].split("=");
    let keyYoutube = part[part.length - 1];
    let baseUrl = "https://www.youtube.com/embed/";
    this.youtubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      baseUrl + keyYoutube
    );
    this.videoUrlDone = true;
  }

  formConfig(): void {
    this.selectWodType(this.wod.titulo);
    this.scoreForm = this.fb.group(this.formObject);
  }

  authAtleta(af): void {
    this.af.auth.subscribe((data: any) => {
      const aux_atleta = this.atletasService.getAtleta_byEmail(data.auth.email);

      aux_atleta.subscribe(data => {
        this.key = data[0].$key;
      });
    });
  }

  validarCampo(campo) {
    if (
      !this.scoreForm.controls[campo].valid &&
      this.scoreForm.controls[campo].touched
    ) {
      return true;
    }
    if (!this.scoreForm.controls[campo].valid && this.trySendScore) return true;
    return false;
  }
}
