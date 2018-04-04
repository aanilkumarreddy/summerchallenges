import { TestBed, inject } from '@angular/core/testing';

import { OrdenarPuestosService } from './ordenar-puestos.service';

describe('OrdenarPuestosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrdenarPuestosService]
    });
  });

  it('should ...', inject([OrdenarPuestosService], (service: OrdenarPuestosService) => {
    expect(service).toBeTruthy();
  }));
});
