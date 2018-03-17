import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DniConfirmComponent } from './dni-confirm.component';

describe('DniConfirmComponent', () => {
  let component: DniConfirmComponent;
  let fixture: ComponentFixture<DniConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DniConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DniConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
