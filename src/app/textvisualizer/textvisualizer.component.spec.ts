import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextvisualizerComponent } from './textvisualizer.component';

describe('TextvisualizerComponent', () => {
  let component: TextvisualizerComponent;
  let fixture: ComponentFixture<TextvisualizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextvisualizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextvisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
