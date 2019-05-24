import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TblThreeClmnComponent } from './tbl-three-clmn.component';

describe('TblThreeClmnComponent', () => {
  let component: TblThreeClmnComponent;
  let fixture: ComponentFixture<TblThreeClmnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TblThreeClmnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TblThreeClmnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
