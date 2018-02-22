import { Component, OnInit } from '@angular/core';
import { InstagramService } from './instagram.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-instagram',
  templateUrl: './instagram.component.html',
  styleUrls: ['./instagram.component.css']
})
export class InstagramComponent implements OnInit {
  private urlImgOhs = 'https://firebasestorage.googleapis.com/v0/b/lnzsumchl1.appspot.com/o/common%2Fgcsummerohs.jpg?alt=media&token=cda1ec80-03a6-44bf-8d3b-2607c70cfb7e';
  private urlImgCluster = 'https://firebasestorage.googleapis.com/v0/b/lnzsumchl1.appspot.com/o/common%2Fgcsumercluster.jpg?alt=media&token=c21f847c-6164-4959-8360-52d1498ef095';
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

    this.clipboard(element.innerText);

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

    console.log("Has copiado: " + text + " en el portapapeles");
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
