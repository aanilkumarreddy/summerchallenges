import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AtletasService } from "../atletas/atletas.service";
import { AngularFire } from "angularfire2";

@Component({
  selector: "app-dni-confirm",
  templateUrl: "./dni-confirm.component.html",
  styleUrls: ["./dni-confirm.component.css"]
})
export class DniConfirmComponent implements OnInit {
  @Output() pago = new EventEmitter;

  public dniConfirmForm: FormGroup;
  public dniRegularExpression = /^[XYZxyz]?\d{7,8}[a-zA-Z]$/;
  public emptyField = false;
  public atleta;

  constructor(
    private fb: FormBuilder,
    private af: AngularFire,
    private atletasService: AtletasService
  ) {
    this.dniConfirmForm = fb.group({
      dni: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(this.dniRegularExpression)
        ])
      ]
    });
  }

  ngOnInit() {
    this.authAtleta();
  }

  pagoClick(){
    this.pago.emit(true);
  }

  validarCampo(campo) {
    if (
      !this.dniConfirmForm.controls[campo].valid &&
      this.dniConfirmForm.controls[campo].touched
    )
      return true;
    if (!this.dniConfirmForm.controls[campo].valid && this.emptyField)
      return true;
    return false;
  }

  authAtleta(): void {
    this.af.auth.subscribe((data: any) => {
      const aux_atleta = this.atletasService.getAtleta_byEmail(data.auth.email);

      aux_atleta.subscribe(data => {
        this.atleta = data[0];
        console.log(this.atleta);
      });
    });
  }

  confirmDNI() {
    let promptDNI = this.dniConfirmForm.value.dni.toLowerCase();
    let atletaDNI = this.atleta.dni.toLowerCase();
    if (atletaDNI === promptDNI) {
      const atl = this.atletasService.getAtleta_byKey(this.atleta.$key);
      atl.update({ estado: 4 });
    }
  }
}
