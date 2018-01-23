import { TestBed, inject } from '@angular/core/testing';

import { RedSysAPIService } from './red-sys-api.service';

describe('RedSysAPIService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RedSysAPIService]
    });
  });

  it('should ...', inject([RedSysAPIService], (service: RedSysAPIService) => {
    expect(service).toBeTruthy();
  }));
});
