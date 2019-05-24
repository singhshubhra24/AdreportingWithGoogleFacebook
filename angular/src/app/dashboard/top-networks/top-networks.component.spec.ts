import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopNetworksComponent } from './top-networks.component';

describe('TopNetworksComponent', () => {
  let component: TopNetworksComponent;
  let fixture: ComponentFixture<TopNetworksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopNetworksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopNetworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
