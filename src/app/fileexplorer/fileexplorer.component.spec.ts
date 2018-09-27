import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileexplorerComponent } from './fileexplorer.component';

describe('FileexplorerComponent', () => {
  let component: FileexplorerComponent;
  let fixture: ComponentFixture<FileexplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileexplorerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileexplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
