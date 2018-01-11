import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamScoresComponent } from './team-scores.component';

describe('TeamScoresComponent', () => {
  let component: TeamScoresComponent;
  let fixture: ComponentFixture<TeamScoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamScoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
