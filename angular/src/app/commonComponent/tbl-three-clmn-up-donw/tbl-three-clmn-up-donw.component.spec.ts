import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TblThreeClmnUpDonwComponent } from './tbl-three-clmn-up-donw.component';

describe('TblThreeClmnUpDonwComponent', () => {
  let component: TblThreeClmnUpDonwComponent;
  let fixture: ComponentFixture<TblThreeClmnUpDonwComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TblThreeClmnUpDonwComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TblThreeClmnUpDonwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
