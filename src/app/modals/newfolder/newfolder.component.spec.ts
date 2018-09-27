import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewfolderComponent } from './newfolder.component';

describe('NewfolderComponent', () => {
  let component: NewfolderComponent;
  let fixture: ComponentFixture<NewfolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewfolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewfolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
