import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WodCardComponent } from './wod-card.component';

describe('WodCardComponent', () => {
  let component: WodCardComponent;
  let fixture: ComponentFixture<WodCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WodCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WodCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
