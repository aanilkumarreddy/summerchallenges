import { Component, OnInit } from "@angular/core";
import { InstagramService } from "./instagram.service";

@Component({
  selector: "app-instagram",
  templateUrl: "./instagram.component.html",
  styleUrls: ["./instagram.component.css"]
})
export class InstagramComponent implements OnInit {
  private ohs: number;
  private cluster: number;
  public instaposts = {
    ohs: {},
    cluster: {}
  };

  constructor(private instaService: InstagramService) {
    this.instaService.getCountHastag("gcsummerohs").subscribe(count => {
      this.ohs = count;
    });

    this.instaService.getCountHastag("gcsummercluster").subscribe(count => {
      this.cluster = count;
    });

    this.instaService.getImageByHashtag("gcsummerchallenge")
      .subscribe(data => {
        this.instaposts.ohs = data;
        console.log(this.instaposts.ohs);
      })

    this.instaService.getImageByHashtag("gcsummerchallenge")
      .subscribe(data => {
        this.instaposts.cluster = data;
      })

  }

  ngOnInit() { }

  clipboard(text) {
    let download = document.createElement('a');
    download.setAttribute('href', 'http://www.fundacionunam.org.mx/wp-content/uploads/2016/03/herpetarioUNAM1.jpg');
    download.setAttribute('download', 'foto.jpg');
    download.click();

    let inputToCopy = document.createElement("input");
    inputToCopy.setAttribute("value", text);
    document.body.appendChild(inputToCopy);
    inputToCopy.select();
    document.execCommand("copy");
    document.body.removeChild(inputToCopy);
  }
}
