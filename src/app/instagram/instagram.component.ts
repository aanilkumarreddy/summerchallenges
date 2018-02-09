import { Component, OnInit } from "@angular/core";
import { InstagramService } from "./instagram.service";

@Component({
  selector: "app-instagram",
  templateUrl: "./instagram.component.html",
  styleUrls: ["./instagram.component.css"]
})
export class InstagramComponent implements OnInit {
  private ohs: number;
  private clusther: number;

  constructor(private instaService: InstagramService) {
    this.instaService.getCountHastag("gcsummerohs").subscribe(count => {
      this.ohs = count;
    });

    this.instaService.getCountHastag("gcsummerclusther").subscribe(count => {
      this.clusther = count;
    });
  }

  ngOnInit() {}
}
