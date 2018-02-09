import { Injectable } from '@angular/core';
import { Http } from '@angular/http/src/http';

@Injectable()
export class InstagramService {
  
  constructor(private http:Http) { }
  
  getCountHastag(hashtag) {
    const url = 'https://api.instagram.com/v1/tags/' + hashtag + '?access_token=6166243869.ee31be3.cb467ab5049943d693fbd663af3ebe6d';
    return this.http.get(url)
      .map((response:any) => JSON.parse(response._body).data.media_count);
  }
}