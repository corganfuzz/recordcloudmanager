import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistogramerComponent } from './histogramer.component';

describe('HistogramerComponent', () => {
  let component: HistogramerComponent;
  let fixture: ComponentFixture<HistogramerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistogramerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistogramerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
