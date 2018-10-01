import { Component, OnInit } from '@angular/core';
import { PrefixerService } from '../services/prefixer/prefixer.service';
import { NgxXml2jsonService } from 'ngx-xml2json';


@Component({
  selector: 'app-histogramer',
  templateUrl: './histogramer.component.html',
  styleUrls: ['./histogramer.component.scss'],
})
export class HistogramerComponent implements OnInit {

  values = '';
  // @Input() dataforInput: any[];


  constructor(private prefixerService: PrefixerService,
              private ngxXml2jsonService: NgxXml2jsonService,) {}

  ngOnInit () {
    // this.test();
  }

  // test () {

  // }

  searchAzure(event: any) {
    this.values = event.target.value;
    this.prefixerService.getDataPrefix(this.values).subscribe(data => {
    const untouchedXml = this.convertXmltoJson(data);
    // const dataTransformed = this.destructuringJson(untouchedXml);
    const results = untouchedXml['EnumerationResults'].Blobs.Blob;

    if (Array.isArray(results) === true) {
       const newResults = results.map(e => {
        return {
          Name: e.Name,
          folder: false,
          parent: 'root',
          url: e.Url,
          type: e.ContentType,
        };
      });
      console.log(newResults);
    } else {
      const { ContentType, Name, Url } = results;
      const newResults = { ContentType, Name, Url, folder: false, parent: 'root' };
      console.log(newResults);
    }



    // const newResults = results.map(e => {
    //   return {
    //     Name: e.Name,
    //     folder: false,
    //     parent: 'root',
    //     url: e.Url,
    //     type: e.ContentType,
    //   };
    // });


    });

    // console.log(this.values);
  }

    convertXmltoJson(xmlValue) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlValue, 'text/xml');
    const obj = this.ngxXml2jsonService.xmlToJson(xml);
    return obj;
  }

  destructuringJson(value) {
    const results = value['EnumerationResults'].Blobs.Blob;

    console.log(results);

    // const newResults = results.map(e => {
    //   return {
    //     Name: e.Name,
    //     folder: false,
    //     parent: 'root',
    //     url: e.Url,
    //     type: e.ContentType,
    //   };
    // });
    // return newResults;
  }

 }

