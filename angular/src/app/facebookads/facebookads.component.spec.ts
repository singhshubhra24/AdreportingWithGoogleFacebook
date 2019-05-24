import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookadsComponent } from './facebookads.component';

describe('FacebookadsComponent', () => {
  let component: FacebookadsComponent;
  let fixture: ComponentFixture<FacebookadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacebookadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
