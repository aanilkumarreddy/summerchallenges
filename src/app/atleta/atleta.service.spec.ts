import { TestBed, inject } from '@angular/core/testing';

import { AtletaService } from './atleta.service';

describe('AtletaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AtletaService]
    });
  });

  it('should ...', inject([AtletaService], (service: AtletaService) => {
    expect(service).toBeTruthy();
  }));
});
