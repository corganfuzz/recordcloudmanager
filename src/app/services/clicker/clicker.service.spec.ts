import { TestBed } from '@angular/core/testing';

import { ClickerService } from './clicker.service';

describe('ClickerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClickerService = TestBed.get(ClickerService);
    expect(service).toBeTruthy();
  });
});
