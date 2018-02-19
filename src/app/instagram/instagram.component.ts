import { Component, OnInit } from '@angular/core';
import { InstagramService } from './instagram.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-instagram',
  templateUrl: './instagram.component.html',
  styleUrls: ['./instagram.component.css']
})
export class InstagramComponent implements OnInit {
  private urlImgOhs = 'http://www.fundacionunam.org.mx/wp-content/uploads/2016/03/herpetarioUNAM1.jpg';
  private urlImgCluster = 'http://www.fundacionunam.org.mx/wp-content/uploads/2016/03/herpetarioUNAM1.jpg';
  private ohs: number;
  private cluster: number;
  private ohsDownloaded: boolean = false;
  private ohsCopied: boolean = false;
  private clusterDownloaded: boolean = false;
  private clusterCopied: boolean = false;
  public instaposts = {
    ohs: {},
    cluster: {}
  };

  constructor(private instaService: InstagramService) {
    this.instaService.getCountHastag('gcsummerohs').subscribe(count => {
      this.ohs = count;
    });

    this.instaService.getCountHastag('gcsummercluster').subscribe(count => {
      this.cluster = count;
    });

    this.instaService.getImageByHashtag('gcsummerchallenge')
      .subscribe(data => {
        this.instaposts.ohs = data;
        console.log(this.instaposts.ohs);
      });;

    this.instaService.getImageByHashtag('gcsummerchallenge')
      .subscribe(data => {
        this.instaposts.cluster = data;
      });

  }

  ngOnInit() { }

  onClick(event) {
    let copied = document.querySelector('.copied');

    copied.classList.remove('off');

    let element = event.target;
    let y = event.clientY - 85;
    let x = event.clientX - (copied.clientWidth / 2);

    copied.setAttribute('style', 'transform: translate(' + x + 'px,' + y + 'px)');

    setTimeout(() => {
      copied.classList.add('off');
    }, 1000);

  }

  clipboard(text, e?) {
    const inputToCopy = document.createElement('input');
    inputToCopy.setAttribute('value', text);
    document.body.appendChild(inputToCopy);
    inputToCopy.select();
    document.execCommand('copy');
    document.body.removeChild(inputToCopy);

    console.log(e);
  }

  downloadImage(url, hashtag) {
    const download = document.createElement('a');
    download.setAttribute('href', url);
    download.setAttribute('download', 'foto.jpg');
    download.click();

    if (hashtag === 'ohs') this.ohsDownloaded = true;
    if (hashtag === 'cluster') this.clusterDownloaded = true;
  }

  copyShareText(hashtag) {
    const text = `
    En el @gcsummerchallenge yo voto por ${hashtag} para el primer wod del clasificatorio online, ¿y tú?
    -
    Si quieres saber cómo hacerlo, entra en la web app del campeonato y sube tu foto. (https://app.gcsummerchallenge.com/instagram)
    `;
    if (hashtag === '#gcsummerohs') this.ohsCopied = true;
    if (hashtag === '#gcsummercluster') this.clusterCopied = true;

    this.clipboard(text);
  }
}
