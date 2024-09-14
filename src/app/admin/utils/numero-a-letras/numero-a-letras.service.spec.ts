import { TestBed } from '@angular/core/testing';

import { NumeroALetrasService } from './numero-a-letras.service';

describe('NumeroALetrasService', () => {
  let service: NumeroALetrasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NumeroALetrasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
