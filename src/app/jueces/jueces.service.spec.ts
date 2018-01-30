import { TestBed, inject } from '@angular/core/testing';

import { JuecesService } from './jueces.service';

describe('JuecesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JuecesService]
    });
  });

  it('should ...', inject([JuecesService], (service: JuecesService) => {
    expect(service).toBeTruthy();
  }));
});
