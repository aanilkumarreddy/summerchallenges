import { TestBed, inject } from '@angular/core/testing';

import { InscripcionService } from './inscripcion.service';

describe('InscripcionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InscripcionService]
    });
  });

  it('should ...', inject([InscripcionService], (service: InscripcionService) => {
    expect(service).toBeTruthy();
  }));
});
