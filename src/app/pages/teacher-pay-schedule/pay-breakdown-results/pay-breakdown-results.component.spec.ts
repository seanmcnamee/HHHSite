import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayBreakdownResultsComponent } from './pay-breakdown-results.component';

describe('PayBreakdownResultsComponent', () => {
  let component: PayBreakdownResultsComponent;
  let fixture: ComponentFixture<PayBreakdownResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayBreakdownResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayBreakdownResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
