import { TestBed } from '@angular/core/testing';

import { CuotaService } from './cuota.service';

describe('CuotaService', () => {
  let service: CuotaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuotaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
