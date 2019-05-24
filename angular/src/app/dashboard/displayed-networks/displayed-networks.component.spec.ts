import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayedNetworksComponent } from './displayed-networks.component';

describe('DisplayedNetworksComponent', () => {
  let component: DisplayedNetworksComponent;
  let fixture: ComponentFixture<DisplayedNetworksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayedNetworksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayedNetworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
