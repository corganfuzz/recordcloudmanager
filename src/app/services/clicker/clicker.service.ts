import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable({
  providedIn: 'root'
})

export class ClickerService {

  myClicker: Observable<any>;

  private myClickerSubject = new BehaviorSubject<any[]>([]);


  constructor() {
    this.myClicker = this.myClickerSubject.asObservable();
   }

   clickerSender (data) {
    // console.log('clicker', data);
    this.myClickerSubject.next(data);
   }


}

