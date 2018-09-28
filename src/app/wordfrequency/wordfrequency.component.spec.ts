import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordfrequencyComponent } from './wordfrequency.component';

describe('WordfrequencyComponent', () => {
  let component: WordfrequencyComponent;
  let fixture: ComponentFixture<WordfrequencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordfrequencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordfrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
