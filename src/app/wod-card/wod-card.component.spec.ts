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
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be 3 items in formObject', () => {
    // Arrange
    component.category = 1;
    fixture.detectChanges();

    // Act
    component.selectWodType('WOD 1');

    // Assert
    console.log(component.formObject);
    expect(component.formObject).toBeTruthy();
  });
});
