import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryGraphWrapComponent } from './summary-graph-wrap.component';

describe('SummaryGraphWrapComponent', () => {
  let component: SummaryGraphWrapComponent;
  let fixture: ComponentFixture<SummaryGraphWrapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryGraphWrapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryGraphWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
