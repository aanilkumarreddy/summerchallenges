import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicWodsComponent } from './public-wods.component';

describe('PublicWodsComponent', () => {
  let component: PublicWodsComponent;
  let fixture: ComponentFixture<PublicWodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicWodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicWodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
