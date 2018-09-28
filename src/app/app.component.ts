import { Component, OnInit } from '@angular/core';
import { FileElement } from './models/element.model';
import { Observable } from 'rxjs';
import { FileService } from './services/file/file.service';
import { ReaderService } from './services/reader/reader.service';
import { ClickerService } from './services/clicker/clicker.service';
import { NgxXml2jsonService } from 'ngx-xml2json';
import * as JSZip from 'jszip';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public fileElements: Observable<FileElement[]>;

  constructor(private fileService: FileService,
              private readerService: ReaderService,
              private ngxXml2jsonService: NgxXml2jsonService,
              private clickerService: ClickerService,
              ) {}

  currentRoot: FileElement;
  currentPath: string;
  canNavigateUp = false;
  azureFiles: any;
  decodedText: any;
  wordCount: any;

  ngOnInit() {

    this.getAzureFiles();
    const folderA = this.fileService.add({ Name: 'Folder A', isFolder: true, parent: 'root' });
    this.updateFileQuery();
  }

  getAzureFiles () {
    this.readerService.getTextFile().subscribe((data: string) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, 'text/xml');
      const obj = this.ngxXml2jsonService.xmlToJson(xml);
      const results = obj['EnumerationResults'].Blobs.Blob;
      const newResults = results.map(e => {
        return {
          Name: e.Name,
          folder: false,
          parent: 'root',
          url: e.Url,
          type: e.ContentType
        };
      });
      this.addFilesToExplorer(newResults);
      this.updateFileQuery();
      });
  }

  addFilesToExplorer(value) {
    this.azureFiles = value;
    value.forEach(element => {
      this.fileService.add(element);
    });
  }

  getValuesPerClick (Azurelink) {

    const cloudUrl = Azurelink.url;
    const fileType = Azurelink.type;

      if (fileType === 'application/zip') {
        this.clickerService.getBlobZip(cloudUrl).subscribe(blobResponse => {
          const jszip = new JSZip();
          return jszip.loadAsync(blobResponse).then((zip) => {
            const extractedfile = Object.keys(zip.files);
            jszip.file(extractedfile).async('string').then(unzipText => {
                this.wordCountSender(unzipText);
                this.frequencyCountSender(unzipText);
            });
        });
      });

      } else {
        this.clickerService.getBlobText(cloudUrl).subscribe(textResponse => {
          this.wordCountSender(textResponse);
          this.frequencyCountSender(textResponse);

      });

      }
  }

  frequencyCountSender (value) {
    this.decodedText = value;
    const arrayOfWords = this.decodedText.split(' ');

    function compressArray(original) {
      const reduceOriginal = original.reduce((countsMap, item) => {
        countsMap[item] = (countsMap[item] || 0) + 1;
        return countsMap;
      }
      , {} );
      return reduceOriginal;
  }

    const results = compressArray(arrayOfWords);

    // console.log('all', results);

    const lessthan5 = Object.entries(results).filter(([key, val]) => {
        return val >= 5;
    });

    const keysAndVals = lessthan5.reduce(([keys, values], [key, val]) => {
        return [[...keys, key], [...values, val]];
    }, [[], []]);

    const words = keysAndVals[0];
    const freqs = keysAndVals[1];

    this.clickerService.frequencySender(keysAndVals);
    // this.clickerService.frequencySender(freqs);

    // console.log(words);
    // console.log(freqs);
  }

  wordCountSender (value) {

    this.decodedText = value;
    this.wordCount = this.decodedText.split(' ').length;
    const arrayOfWords = this.decodedText.split(' ');

    this.clickerService.clickerSender(this.wordCount);
  }

  addFolder(folder: { name: string }) {
    this.fileService.add({ isFolder: true, Name: folder.name, parent: this.currentRoot ? this.currentRoot.id : 'root' });
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
    this.fileElements = this.fileService.queryInFolder(this.currentRoot ? this.currentRoot.id : 'root');
  }


}
