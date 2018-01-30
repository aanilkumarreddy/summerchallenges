import { TestBed, inject } from '@angular/core/testing';

import { VoluntariosService } from './voluntarios.service';

describe('VoluntariosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VoluntariosService]
    });
  });

  it('should ...', inject([VoluntariosService], (service: VoluntariosService) => {
    expect(service).toBeTruthy();
  }));
});
