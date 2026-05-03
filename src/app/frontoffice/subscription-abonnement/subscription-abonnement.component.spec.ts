import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionAbonnementComponent } from './subscription-abonnement.component';

describe('SubscriptionAbonnementComponent', () => {
  let component: SubscriptionAbonnementComponent;
  let fixture: ComponentFixture<SubscriptionAbonnementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionAbonnementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionAbonnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
