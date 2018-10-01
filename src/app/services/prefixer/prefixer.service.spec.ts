import { TestBed } from '@angular/core/testing';

import { PrefixerService } from './prefixer.service';

describe('PrefixerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrefixerService = TestBed.get(PrefixerService);
    expect(service).toBeTruthy();
  });
});
