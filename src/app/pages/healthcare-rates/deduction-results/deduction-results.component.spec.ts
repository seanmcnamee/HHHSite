import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductionResultsComponent } from './deduction-results.component';

describe('DeductionResultsComponent', () => {
  let component: DeductionResultsComponent;
  let fixture: ComponentFixture<DeductionResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeductionResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeductionResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
