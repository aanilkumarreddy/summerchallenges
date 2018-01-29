import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroJuezComponent } from './registro-juez.component';

describe('RegistroJuezComponent', () => {
  let component: RegistroJuezComponent;
  let fixture: ComponentFixture<RegistroJuezComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroJuezComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroJuezComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
