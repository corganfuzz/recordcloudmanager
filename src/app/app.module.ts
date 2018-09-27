import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { FileService } from './services/file/file.service';

import { ReaderService } from './services/reader/reader.service';
import { ClickerService } from './services/clicker/clicker.service';
import { HttpClientModule } from '@angular/common/http';

import { MatToolbarModule,
         MatGridListModule,
         MatIconModule,
         MatCardModule,
         MatMenuModule,
         MatDialogModule,
         MatInputModule,
         MatButtonModule } from '@angular/material';

import { FileexplorerComponent } from './fileexplorer/fileexplorer.component';
import { HistogramerComponent } from './histogramer/histogramer.component';
import { TextvisualizerComponent } from './textvisualizer/textvisualizer.component';
import { NewfolderComponent } from './modals/newfolder/newfolder.component';
import { RenameComponent } from './modals/rename/rename.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FileexplorerComponent,
    HistogramerComponent,
    TextvisualizerComponent,
    NewfolderComponent,
    RenameComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    FileService,
    ReaderService,
    ClickerService,
  ],
  entryComponents: [NewfolderComponent, RenameComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
