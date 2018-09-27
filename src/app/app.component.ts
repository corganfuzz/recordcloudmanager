import { Component, OnInit } from '@angular/core';
import { FileElement } from './models/element.model';
import { Observable } from 'rxjs';
import { FileService } from './services/file/file.service';
import { ReaderService } from './services/reader/reader.service';
import { ClickerService } from './services/clicker/clicker.service';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { HttpClient } from '@angular/common/http';
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
              private http: HttpClient
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
        this.http.get(cloudUrl, { responseType: 'blob' }).subscribe(blobResponse => {
          const jszip = new JSZip();
          return jszip.loadAsync(blobResponse).then((zip) => {
            const extractedfile = Object.keys(zip.files);
            jszip.file(extractedfile).async('string').then(unzipText => {
                this.wordCountSender(unzipText);
            });
        });
      });

      } else {
        this.http.get(cloudUrl, { responseType: 'text' }).subscribe(textResponse => {
          this.wordCountSender(textResponse);
      });

      }
  }

  wordCountSender (value) {
    this.decodedText = value;
    this.wordCount = this.decodedText.split(' ').length;
    const arrayOfWords = this.decodedText.split(' ');


    function compressArray(original) {
      return original
      .reduce((countsMap, item) => countsMap
      .set(item, countsMap
      .get(item) + 1 || 1), new Map());

  }

    const results = compressArray(arrayOfWords);

    // console.log('all', results);

    // const one = Array.from(results.keys());
    // const two = Array.from(results.values());

    // console.log(one);
    // console.log(two.filter( x => x >= 5));
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
