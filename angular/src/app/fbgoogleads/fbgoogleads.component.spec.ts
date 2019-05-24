import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FbgoogleadsComponent } from './fbgoogleads.component';

describe('FbgoogleadsComponent', () => {
  let component: FbgoogleadsComponent;
  let fixture: ComponentFixture<FbgoogleadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FbgoogleadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FbgoogleadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
