import { Component, OnInit } from '@angular/core';
import { AtletasService } from "../atletas/atletas.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-team-scores',
  templateUrl: './team-scores.component.html',
  styleUrls: ['./team-scores.component.css']
})
export class TeamScoresComponent implements OnInit {
  public atleta : any;
  public flag : boolean;
  public atl_1 : any;
  public atl_2 : any;
  public atl_3 : any;
  public team : Array<any>;
  constructor(private atletasService : AtletasService,
              private router : Router) {
    this.atleta = atletasService.atleta;
    if(!this.atleta || this.atleta.id_categoria != 4){
      this.router.navigate(['/login']);
    }
    this.flag = true;

    if(this.atleta && this.atleta.atl_1){
      console.log("Hay atleta 1");
    }else{
      this.flag = false;
    }
    if(this.atleta && this.atleta.atl_2){
      console.log("Hay atleta 2");
    }else{
      this.flag = false;
    }
    if(this.atleta && this.atleta.atl_3){
      console.log("Hay atleta 3");
    }else{
      this.flag = false;
    }
    const aux_1 = this.atletasService.getTeam_atl_1(this.atleta.$key);
    const aux_2 = this.atletasService.getTeam_atl_2(this.atleta.$key);
    const aux_3 = this.atletasService.getTeam_atl_3(this.atleta.$key);

    aux_1.subscribe(data =>{
      this.atl_1 = data;
      console.log(this.atl_1);
    })

    aux_2.subscribe(data =>{
      this.atl_2 = data;
      console.log(this.atl_2);
    })

    aux_3.subscribe(data =>{
      this.atl_3 = data;
      console.log(this.atl_3);
    })

    console.log(this.atleta);


   }

  ngOnInit() {
  }

  addAthlete_3(name, id){
    let atl_3 = {
      nombre : name.value,
      id : id.value
    };
    this.atletasService.updateTeam_3(this.atleta.$key, atl_3);
  }

  removeUrl(wod, atleta){
    if(!wod || !atleta){return}
    if(atleta == 1){
      var aux = this.atletasService.getTeam_atl_1(this.atleta.$key);
    }else if(atleta == 2){
      var aux = this.atletasService.getTeam_atl_2(this.atleta.$key);
    }else if(atleta == 3){
      var aux = this.atletasService.getTeam_atl_3(this.atleta.$key);
    }

    if(wod == 1){
      aux.update({url_1 : ""});
    }else if(wod == 2){
      aux.update({url_2 : ""});
    }    
  }

  addUrl(wod, atleta, url){
    if(!wod || !atleta || !url.value){return}
    if(atleta == 1){
      var aux = this.atletasService.getTeam_atl_1(this.atleta.$key);
    }else if(atleta == 2){
      var aux = this.atletasService.getTeam_atl_2(this.atleta.$key);
    }else if(atleta == 3){
      var aux = this.atletasService.getTeam_atl_3(this.atleta.$key);
    }

    if(wod == 1){
      console.log("estoy aqui")
      aux.update({url_1 : url.value});
    }else if(wod == 2){
      aux.update({url_2 : url.value});
    }  
  }

  addAthlete(atleta, name, id){
      if(!atleta || !name.value || !id.value){return}
        let atl = {
          nombre : name.value,
          id : id.value
        };

      if(atleta == 1){
        this.atletasService.updateTeam_1(this.atleta.$key, atl);
      }else if(atleta == 2){
        this.atletasService.updateTeam_2(this.atleta.$key, atl);
      }else if(atleta == 3){
        this.atletasService.updateTeam_3(this.atleta.$key, atl);        
      }
      
    }
  }
