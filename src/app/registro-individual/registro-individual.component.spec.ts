import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroIndividualComponent } from './registro-individual.component';

describe('RegistroIndividualComponent', () => {
  let component: RegistroIndividualComponent;
  let fixture: ComponentFixture<RegistroIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
