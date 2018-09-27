import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable({
  providedIn: 'root'
})

export class ClickerService {

  myMethod: Observable<any>;

  private myMethodSubject = new BehaviorSubject<any[]>([]);


  constructor() {
    this.myMethod = this.myMethodSubject.asObservable();
   }

   clickerSender (data) {
    // console.log('clicker', data);
    this.myMethodSubject.next(data);
   }


}

