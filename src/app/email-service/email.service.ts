import { Injectable } from '@angular/core';
import { Http } from '@angular/http/src/http';

@Injectable()
export class EmailService {
  private base_url = 'https://gcsummerchallenge.com/api/email';
  constructor(private http:Http) { }

  send(section, key) {
    const url = this.base_url + "/" + section + "/" + key;
    return this.http.get(url)
      .map(response => response);
  }
}
