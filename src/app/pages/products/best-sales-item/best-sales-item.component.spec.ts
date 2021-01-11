import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestSalesItemComponent } from './best-sales-item.component';

describe('BestSalesItemComponent', () => {
  let component: BestSalesItemComponent;
  let fixture: ComponentFixture<BestSalesItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BestSalesItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BestSalesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
