import { Injectable } from '@angular/core';
import { Http } from '@angular/http/src/http';

@Injectable()
export class InstagramService {

  private url = 'https://api.instagram.com/v1/tags/';
  private token = '6166243869.ee31be3.cb467ab5049943d693fbd663af3ebe6d';

  constructor(private http: Http) { }

  generateUrl(hashtag) {
    return this.url + hashtag + '?access_token=' + this.token;
  }

  getCountHastag(hashtag) {
    const url = this.generateUrl(hashtag);
    return this.http.get(url)
      .map((response: any) => JSON.parse(response._body).data.media_count);
  }

  getImageByHashtag(hashtag) {
    const url = this.generateUrl(hashtag);

    return this.http.get(url)
      .map((response: any) => JSON.parse(response._body));
  }
}