import { TestBed } from '@angular/core/testing';

import { LegajoService } from './legajo.service';

describe('LegajoService', () => {
  let service: LegajoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LegajoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
