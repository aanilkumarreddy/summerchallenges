import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRedsysComponent } from './form-redsys.component';

describe('FormRedsysComponent', () => {
  let component: FormRedsysComponent;
  let fixture: ComponentFixture<FormRedsysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormRedsysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRedsysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
