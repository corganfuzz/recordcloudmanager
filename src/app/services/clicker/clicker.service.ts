import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class ClickerService {

  myClicker: Observable<any>;

  private myClickerSubject = new BehaviorSubject<any[]>([]);


  constructor(private http: HttpClient) {
    this.myClicker = this.myClickerSubject.asObservable();
   }

   clickerSender (data) {
    // console.log('clicker', data);
    this.myClickerSubject.next(data);
   }

   getBlobText (cloudUrl) {
     const blobber = this.http.get(cloudUrl, { responseType: 'text'});
     return blobber;
   }

   getBlobZip (cloudUrl) {
     const zipper = this.http.get(cloudUrl, {responseType: 'blob'});
     return zipper;
   }


}

