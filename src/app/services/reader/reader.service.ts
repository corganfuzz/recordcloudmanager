import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class ReaderService {

  private azureURL = 'https://codingmaana.blob.core.windows.net/files/?comp=list';

  constructor(private http: HttpClient) {}

  getTextFile() {
    const getter = this.http.get(this.azureURL, { responseType: 'text' });
    return getter;
  }

  getZipFile(url, type) {
    url = this.azureURL;
    const getZip = this.http.get(url, {responseType: 'arraybuffer'});
    return getZip;
  }

}
