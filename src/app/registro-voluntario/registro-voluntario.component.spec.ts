import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroVoluntarioComponent } from './registro-voluntario.component';

describe('RegistroVoluntarioComponent', () => {
  let component: RegistroVoluntarioComponent;
  let fixture: ComponentFixture<RegistroVoluntarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroVoluntarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroVoluntarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
