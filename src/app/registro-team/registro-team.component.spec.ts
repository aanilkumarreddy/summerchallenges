import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroTeamComponent } from './registro-team.component';

describe('RegistroTeamComponent', () => {
  let component: RegistroTeamComponent;
  let fixture: ComponentFixture<RegistroTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
