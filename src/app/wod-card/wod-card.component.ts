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
export class WodCardComponent {
  @Input() wod: any;

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
    private af: AngularFire,
  ) {
    this.formConfig(fb);
    this.authAtleta(af);
  }

  updateWod(post) {
    if (!this.scoreForm.valid) {
      this.trySendScore = true;
      this.checkVideoUrl(post.url);
      return;
    }

    this.checkVideoUrl(post.url, () => {

      const wodData = {
        key: this.key,
        name: this.wod.titulo.toLowerCase().replace(" ", "_"),
        data: {
          puntuacion: post.kilos * post.reps,
          kilos: post.kilos,
          reps: post.reps,
          tiempo: post.time,
          url: post.url,
          puesto: ""
        }
      };
      this.wodsService.update_wod(wodData);
      this.sendedScore = true;
      // this.router.navigate(["/"]);
    });
  }

  checkVideoUrl(url: string, fn?: any): void {
    if (!this.scoreForm.controls["url"].valid || !this.scoreForm.valid) return;

    this.http
      .get(url)
      .toPromise()
      .then(res => {
        this.checkUrlYoutube(url);
        fn();
      })
      .catch(err => {
        this.errVideoUrl = true;
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

  formConfig(fb: FormBuilder): void {
    this.scoreForm = fb.group({
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
    });
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
    ){
      return true;
    }
    if (!this.scoreForm.controls[campo].valid && this.trySendScore) return true;
    return false;
  }
}
