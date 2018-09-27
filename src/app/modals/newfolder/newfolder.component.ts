import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-newfolder',
  templateUrl: './newfolder.component.html',
  styleUrls: ['./newfolder.component.scss']
})
export class NewfolderComponent implements OnInit {

  constructor(public modalRef: MatDialogRef<NewfolderComponent>) { }

  folderName: string;

  ngOnInit() {
  }

}
