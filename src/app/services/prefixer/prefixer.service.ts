import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class PrefixerService {

   private searchUrl: string;


  constructor(private http: HttpClient) {}

  getDataPrefix(str: string): Observable<any> {

    this.searchUrl = 'https://codingmaana.blob.core.windows.net/files/?comp=list&prefix=' + str;
    return this.http.get(this.searchUrl, {responseType: 'text'});

  }
}
