import { Component, OnInit } from '@angular/core';
import { WodsService } from "../wods/wods.service";

@Component({
  selector: 'app-public-wods',
  templateUrl: './public-wods.component.html',
  styleUrls: ['./public-wods.component.css']
})
export class PublicWodsComponent implements OnInit {
  public wods;
  public aux_wods;

  constructor(private wodsService : WodsService) { 
    this.wods = this.wodsService.wods;
  }

  ngOnInit() {
  }

  setWods(wods){
    wods.forEach(wod => {
      wod.descripcion = wod.descripcion.split(">");
      wod.descripcion.forEach(des =>{
        des = des.split("*");
      })
    })
    this.wods = wods;
    this.getWods(this.wods, 0);
  }

  getWods(wods, teen){
    if(teen == 1){
      this.aux_wods = wods.filter(wod => wod.titulo  == "WORKOUT 1 - TEENAGERS" || wod.titulo == "WORKOUT 2 - TEENAGERS");
    }else{
      this.aux_wods = wods.filter(wod => wod.titulo == "WORKOUT 1" || wod.titulo == "WORKOUT 2");
    }  
}

}
