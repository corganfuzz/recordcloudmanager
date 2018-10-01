import { Component, OnInit } from '@angular/core';
import { FileElement } from './models/element.model';
import { Observable } from 'rxjs';
import { FileService } from './services/file/file.service';
import { ReaderService } from './services/reader/reader.service';
import { ClickerService } from './services/clicker/clicker.service';
import { PrefixerService } from './services/prefixer/prefixer.service';
import { NgxXml2jsonService } from 'ngx-xml2json';
import * as JSZip from 'jszip';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public fileElements: Observable<FileElement[]>;

  constructor(
    private fileService: FileService,
    private readerService: ReaderService,
    private ngxXml2jsonService: NgxXml2jsonService,
    private clickerService: ClickerService,
    private prefixerService: PrefixerService,
  ) {}

  currentRoot: FileElement;
  currentPath: string;
  canNavigateUp = false;
  azureFiles: any;
  decodedText: any;
  wordCount: any;
  dataforInput: any[];
  values = '';

  ngOnInit() {
    this.getAzureFiles();
    const folderA = this.fileService.add({
      Name: 'Folder A',
      isFolder: true,
      parent: 'root',
    });
    this.updateFileQuery();
  }

  searchAzure (event: any) {
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
        this.addFilesToExplorer(newResults);
      } else {
        const { ContentType, Name, Url } = results;
        const newResults = { ContentType, Name, Url, folder: false, parent: 'root' };
        console.log(newResults);
        this.addFilesToExplorer(newResults);
      }
    });

  }

  getAzureFiles() {
    // this.readerService.getTextFile().subscribe((response: string) => {
    //   const untouchedXml = this.convertXmltoJson(response);
    //   const dataTransformed = this.destructuringJson(untouchedXml);
    //   this.dataforInput = dataTransformed;
    //   this.addFilesToExplorer(dataTransformed);
    //   this.updateFileQuery();
    // });

  }

  convertXmltoJson(xmlValue) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlValue, 'text/xml');
    const obj = this.ngxXml2jsonService.xmlToJson(xml);
    return obj;
  }

  destructuringJson(value) {
    const results = value['EnumerationResults'].Blobs.Blob;
    const newResults = results.map(e => {
      return {
        Name: e.Name,
        folder: false,
        parent: 'root',
        url: e.Url,
        type: e.ContentType,
      };
    });
    return newResults;
  }

  addFilesToExplorer(value) {
    this.azureFiles = value;
    value.forEach(element => {
      this.fileService.add(element);
    });
    this.updateFileQuery();
  }

  getValuesPerClick(Azurelink) {
    const cloudUrl = Azurelink.url;
    const fileType = Azurelink.type;

    if (fileType === 'application/zip') {
      this.clickerService.getBlobZip(cloudUrl).subscribe(blobResponse => {
        this.unzipBlobFile(blobResponse);
      });
    } else {
      this.clickerService.getBlobText(cloudUrl).subscribe(textResponse => {
        this.wordCountSender(textResponse);
        this.frequencyCountSender(textResponse);
      });
    }
  }

  unzipBlobFile(response) {
    const jszip = new JSZip();
    return jszip.loadAsync(response).then(zip => {
      const extractedfile = [Object.keys(zip.files)[0]];
      jszip
        .file(extractedfile)
        .async('string')
        .then(unzipText => {
          this.wordCountSender(unzipText);
          this.frequencyCountSender(unzipText);
        });
    });
  }

  frequencyCountSender(value) {
    this.decodedText = value;
    const arrayOfWords = this.decodedText.split(' ');
    const results = this.compressArray(arrayOfWords);
    const lessthan5 = Object.entries(results).filter(([key, val]) => {
      return val >= 5;
    });

    const keysAndVals = lessthan5.reduce(
      ([keys, values], [key, val]) => {
        return [[...keys, key], [...values, val]];
      },
      [[], []],
    );
    // const words = keysAndVals[0];
    // const freqs = keysAndVals[1];
    this.clickerService.frequencySender(keysAndVals);
  }

  compressArray(originalArray) {
    const reduceOriginal = originalArray.reduce((countsMap, item) => {
      countsMap[item] = (countsMap[item] || 0) + 1;
      return countsMap;
    }, {});
    return reduceOriginal;
  }

  wordCountSender(value) {
    this.decodedText = value;
    this.wordCount = this.decodedText.split(' ').length;
    const arrayOfWords = this.decodedText.split(' ');

    this.clickerService.clickerSender(this.wordCount);
  }

  addFolder(folder: { name: string }) {
    this.fileService.add({
      isFolder: true,
      Name: folder.name,
      parent: this.currentRoot ? this.currentRoot.id : 'root',
    });
    this.updateFileQuery();
  }

  removeElement(element: FileElement) {
    this.fileService.delete(element.id);
    this.updateFileQuery();
  }

  navigateToFolder(element: FileElement) {
    this.currentRoot = element;
    this.updateFileQuery();
    this.currentPath = this.addToPath(this.currentPath, element.Name);
    this.canNavigateUp = true;
  }

  navigateUp() {
    if (this.currentRoot && this.currentRoot.parent === 'root') {
      this.currentRoot = null;
      this.canNavigateUp = false;
      this.updateFileQuery();
    } else {
      this.currentRoot = this.fileService.get(this.currentRoot.parent);
      this.updateFileQuery();
    }
    this.currentPath = this.removeFromPath(this.currentPath);
  }

  addToPath(path: string, folderName: string) {
    let pt = path ? path : '';
    pt += `${folderName}/`;
    return pt;
  }

  removeFromPath(path: string) {
    let pt = path ? path : '';
    const split = pt.split('/');
    split.splice(split.length - 2, 1);
    pt = split.join('/');
    return pt;
  }

  moveElement(event: { element: FileElement; moveTo: FileElement }) {
    this.fileService.update(event.element.id, { parent: event.moveTo.id });
    this.updateFileQuery();
  }

  renameElement(element: FileElement) {
    this.fileService.update(element.id, { Name: element.Name });
    this.updateFileQuery();
  }

  updateFileQuery() {
    this.fileElements = this.fileService.queryInFolder(
      this.currentRoot ? this.currentRoot.id : 'root',
    );
  }
}
