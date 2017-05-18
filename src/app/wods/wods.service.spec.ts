import { TestBed, inject } from '@angular/core/testing';

import { WodsService } from './wods.service';

describe('WodsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WodsService]
    });
  });

  it('should ...', inject([WodsService], (service: WodsService) => {
    expect(service).toBeTruthy();
  }));
});
