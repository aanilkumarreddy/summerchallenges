import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInscripcionesComponent } from './admin-inscripciones.component';

describe('AdminInscripcionesComponent', () => {
  let component: AdminInscripcionesComponent;
  let fixture: ComponentFixture<AdminInscripcionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminInscripcionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
