import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { WodsComponent } from './wods.component';
import { WodCardComponent } from '../wod-card/wod-card.component';
import { WodsService } from './wods.service';

class RouterStub{
  navigate(params){
  }
}

class ActivatedRouteStub {
  params: Observable<any> = Observable.empty();
}

class WodsServiceStub {}
describe('WodsComponent Integration Tests', () => {
  let component: WodsComponent;
  let fixture: ComponentFixture<WodsComponent>;
  let WodsService: WodsService;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WodsComponent, WodCardComponent ],
      providers: [
        {provide: Router, useClass: RouterStub},
        {provide: ActivatedRoute, useClass: ActivatedRouteStub},
        {provide: WodsService, useClass: WodsServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WodsComponent);
    component = fixture.componentInstance;
    WodsService = TestBed.get(WodsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect /admin ig email is "info@summerchallenges.com"', () => {
    // Arrange
    const router = TestBed.get(Router);
    const spy = spyOn(router, 'navigate');
    const data = {email: 'info@summerchallenges.com'};

    // Act
    component.checkAdminAccess(data);

    // Assert
    console.log(data.email);
    expect(spy).toHaveBeenCalledWith(['admin']);

  });

});
