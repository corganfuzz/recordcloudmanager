import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rename',
  templateUrl: './rename.component.html',
  styleUrls: ['./rename.component.scss']
})
export class RenameComponent implements OnInit {

  constructor(public modalRef: MatDialogRef<RenameComponent>) { }

  folderName: string;

  ngOnInit() {
  }

}
