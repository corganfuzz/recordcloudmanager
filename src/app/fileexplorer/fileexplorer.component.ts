import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppComponent } from './../app.component';
import { FileElement } from '../models/element.model';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { NewfolderComponent } from '../modals/newfolder/newfolder.component';
import { RenameComponent } from '../modals/rename/rename.component';

@Component({
  selector: 'app-fileexplorer',
  templateUrl: './fileexplorer.component.html',
  styleUrls: ['./fileexplorer.component.scss'],
})
export class FileexplorerComponent {
  constructor(public dialog: MatDialog, private appComp: AppComponent) {}

  @Input()
  fileElements: FileElement[];
  @Input()
  canNavigateUp: string;
  @Input()
  path: string;

  @Output()
  folderAdded = new EventEmitter<{ name: string }>();
  @Output()
  elementRemoved = new EventEmitter<FileElement>();
  @Output()
  elementRenamed = new EventEmitter<FileElement>();
  @Output()
  elementMoved = new EventEmitter<{
    element: FileElement;
    moveTo: FileElement;
  }>();
  @Output()
  navigatedDown = new EventEmitter<FileElement>();
  @Output()
  navigatedUp = new EventEmitter();

  deleteElement(element: FileElement) {
    this.elementRemoved.emit(element);
  }

  openMenu(event: MouseEvent, viewChild: MatMenuTrigger) {
    event.preventDefault();
    viewChild.openMenu();
  }

  navigate(element: FileElement) {
    if (element.isFolder) {
      this.navigatedDown.emit(element);
    } else {
      this.appComp.getValuesPerClick(element);
    }
  }

  navigateUp() {
    this.navigatedUp.emit();
  }

  moveElement(element: FileElement, moveTo: FileElement) {
    this.elementMoved.emit({ element: element, moveTo: moveTo });
  }

  openFolderModal() {
    const modalRef = this.dialog.open(NewfolderComponent);
    modalRef.afterClosed().subscribe(res => {
      if (res) {
        this.folderAdded.emit({ name: res });
      }
    });
  }

  openRenameModal(element: FileElement) {
    const modalRef = this.dialog.open(RenameComponent);
    modalRef.afterClosed().subscribe(res => {
      if (res) {
        element.Name = res;
        this.elementRenamed.emit(element);
      }
    });
  }
}
