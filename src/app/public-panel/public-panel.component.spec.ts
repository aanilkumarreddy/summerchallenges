import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPanelComponent } from './public-panel.component';

describe('PublicPanelComponent', () => {
  let component: PublicPanelComponent;
  let fixture: ComponentFixture<PublicPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
