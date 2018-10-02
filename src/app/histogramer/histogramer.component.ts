import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-histogramer',
  templateUrl: './histogramer.component.html',
  styleUrls: ['./histogramer.component.scss'],
})
export class HistogramerComponent implements OnInit {

  values = '';
  @Input() dataforInput: any[];


  constructor() {}

  ngOnInit () {

  }

  searchAzure(event: any) {

    this.values = event.target.value;
    // this.appComp.getAzureFiles();
    console.log(this.dataforInput);
  }

 }

