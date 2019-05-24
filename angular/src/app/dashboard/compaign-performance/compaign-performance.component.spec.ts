import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaignPerformanceComponent } from './compaign-performance.component';

describe('CompaignPerformanceComponent', () => {
  let component: CompaignPerformanceComponent;
  let fixture: ComponentFixture<CompaignPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompaignPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaignPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
