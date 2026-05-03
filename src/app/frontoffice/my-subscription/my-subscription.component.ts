import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionService } from '../services/subscription.service';
import { SubscriptionPlan, Subscription, PaymentResponse } from '../models/subscription.model';

@Component({
  selector: 'app-my-subscription',
  templateUrl: './my-subscription.component.html',
  styleUrls: ['./my-subscription.component.scss']
})
export class MySubscriptionComponent implements OnInit {
  plan!: SubscriptionPlan;
  renewDate = new Date();
  progress = 0.75;
  autoRenew = false;
  showPayment = false;
  currentSubscription: Subscription | null = null;

  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.refreshPlan();
    this.subscriptionService.currentSubscription$.subscribe(sub => {
      if (sub?.plan) {
        this.plan = sub.plan;
        this.renewDate = new Date();
        this.renewDate.setMonth(this.renewDate.getMonth() + (sub.duration || 1));
      }
    });
  }

  private refreshPlan(): void {
    this.plan = this.subscriptionService.getCurrentPlan();
    this.renewDate = new Date();
    this.renewDate.setMonth(this.renewDate.getMonth() + 2);
  }

  toggleAutoRenew(): void {
    this.autoRenew = !this.autoRenew;
  }

  changePlan(): void {
    this.router.navigate(['/subscription-management']);
  }

  renew(): void {
    this.currentSubscription = this.subscriptionService.buildSubscription(this.plan, 'monthly');
    this.showPayment = true;
  }

  closePayment(): void {
    this.showPayment = false;
    this.currentSubscription = null;
  }

  onRenewSuccess(_response: PaymentResponse): void {
    this.showPayment = false;
    this.renewDate = new Date();
    this.renewDate.setMonth(this.renewDate.getMonth() + 1);
    this.progress = 0;
  }
}
