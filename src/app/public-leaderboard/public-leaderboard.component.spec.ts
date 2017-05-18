import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicLeaderboardComponent } from './public-leaderboard.component';

describe('PublicLeaderboardComponent', () => {
  let component: PublicLeaderboardComponent;
  let fixture: ComponentFixture<PublicLeaderboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicLeaderboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
