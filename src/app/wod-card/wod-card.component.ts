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

@Component({
  selector: "app-wod-card",
  templateUrl: "./wod-card.component.html",
  styleUrls: ["./wod-card.component.css"]
})
export class WodCardComponent implements OnInit {
  @Input() wod: any;
  @Input() category: any;

  public wodData;
  public formObject;
  public youtubeUrl: SafeResourceUrl;
  public videoUrlDone: boolean = false;
  public sendedScore: boolean = false;
  public errVideoUrl: boolean = false;
  public scoreForm: FormGroup;
  public auth;
  public key;
  public trySendScore;

  // private timeExpReg = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
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
  }

  selectWodType(typeWod) {
    // Aqui lo ideal sería meter un switch o llamada a servicio
    // Que gestionase cualquier tipo de wod con sus nombres estipulados
    // Y genere el form en consecuencia. Asi se tendría una solución general.

    this.formObject = {
      reps: [null, Validators.required],
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
      name: typeWod.toLowerCase().replace(" ", "_"),
      data: {
        kilos: 0,
        kilos2: 0,
        reps: 0,
        reps2: 0,
        puesto: "",
        puntuacion: 0,
        url: ""
      }
    };

    if (typeWod == "WOD 1") {
      this.formObject.kilos = [null, Validators.required];

      if (this.category === 3 || this.category === 4) {
        this.formObject.kilos2 = [null, Validators.required];
        this.formObject.reps2 = [null, Validators.required];
        this.formObject.url2 = [
          null,
          Validators.compose([
            Validators.required,
            Validators.pattern(this.urlExpReg)
          ])
        ];

        this.wodData.data.kilos2 = 0;
        this.wodData.data.reps2 = 0;
        this.wodData.data.url2 = 0;
      }
    }

    if (typeWod == "WOD 2") {
      if (this.category === 3 || this.category === 4) {
        this.formObject.reps2 = [null, Validators.required];
        this.formObject.url2 = [
          null,
          Validators.compose([
            Validators.required,
            Validators.pattern(this.urlExpReg)
          ])
        ];

        this.wodData.data.reps2 = 0;
        this.wodData.data.url2 = 0;
      }
    }
  }

  updateWod(post) {
    if (!this.scoreForm.valid) {
      this.trySendScore = true;
      this.checkVideoUrl(post.url);
      return;
    }
    this.checkVideoUrl(post.url, () => this.setWodScore(post));
  }

  setWodScore(post) {
    // Aqui tambien tendría que haber un switch
    // O un handler del servicio para que concuerde
    // La adquisicion de datos con el form correspondiente

    if (this.wod.titulo == "WOD 1") {
      this.wodData.data.kilos = parseFloat(post.kilos);
      this.wodData.data.puntuacion = post.reps * post.kilos;
      if (this.isTeamCategory()) {
        this.wodData.data.kilos2 = parseFloat(post.kilos2);
        this.wodData.data.reps2 = parseFloat(post.reps2);
        this.wodData.data.puntuacion = post.reps * post.kilos + post.reps2 * post.kilos2;
        this.wodData.data.url2 = post.url2;
      }
    }
    if (this.wod.titulo == "WOD 2") {
      this.wodData.data.puntuacion = parseFloat(post.reps);
      if (this.isTeamCategory()) {
        this.wodData.data.puntuacion = post.reps + post.reps2;
        this.wodData.data.url2 = post.url2;
      }
    }

    this.wodData.data.reps = parseFloat(post.reps);
    this.wodData.data.url = post.url;
    this.wodData.key = this.key;

    this.sendedScore = true;
    this.wodsService.update_wod(this.wodData);
  }

  isTeamCategory(){
    return this.category === 3 || this.category === 4;
  }

  checkVideoUrl(url: string, fn?: any): void {
    if (!this.scoreForm.controls["url"].valid || !this.scoreForm.valid) return;

    this.http
      .get(url)
      .toPromise()
      .then(res => {
        console.log("No Error");
        this.checkUrlYoutube(url);
        fn();
        console.log("no error: ", fn);
      })
      .catch(err => {
        console.log("Error");
        console.log(err);

        this.errVideoUrl = true;
        console.log("error chechVideoUrl: ", this.errVideoUrl);
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
