import { TestBed, inject } from '@angular/core/testing';

import { AtletasService } from './atletas.service';

describe('AtletasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AtletasService]
    });
  });

  it('should ...', inject([AtletasService], (service: AtletasService) => {
    expect(service).toBeTruthy();
  }));
});
