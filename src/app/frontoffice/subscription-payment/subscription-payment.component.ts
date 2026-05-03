import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  SubscriptionPlan, Subscription, Payment, PaymentResponse, PaymentMethod, MobileProvider
} from '../models/subscription.model';
import { SubscriptionService } from '../services/subscription.service';
import { CurrencyService } from '../services/currency.service';
import { AuthService } from '../services/auth.service';
import { PdfService } from '../services/pdf.service';
import { PromoCodeService, PromoValidationResult } from '../services/promo-code.service';

const SESSION_MS = 15 * 60 * 1000;

@Component({
  selector: 'app-subscription-payment',
  templateUrl: './subscription-payment.component.html',
  styleUrls: ['./subscription-payment.component.scss']
})
export class SubscriptionPaymentComponent implements OnInit, OnChanges, OnDestroy {
  @Input() plan!: SubscriptionPlan;
  @Input() subscription!: Subscription;
  @Input() selectedPaymentMethod: PaymentMethod | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() paymentSuccess = new EventEmitter<PaymentResponse>();

  currentStep: 1 | 2 | 3 | 4 = 1;
  activeMethod: PaymentMethod | null = null;

  paymentForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showSuccessModal = false;
  lastResponse: PaymentResponse | null = null;

  promoMessage = '';
  promoResult: PromoValidationResult | null = null;
  promoChecking = false;

  timerLabel = '';
  private timerId: ReturnType<typeof setInterval> | null = null;
  private sessionEnd = 0;

  mobileProviders: { id: MobileProvider; label: string; icon: string }[] = [
    { id: 'D17', label: 'D17', icon: '📱' },
    { id: 'Flouci', label: 'Flouci', icon: '💚' },
    { id: 'Konnect', label: 'Konnect', icon: '🔗' }
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly subscriptionService: SubscriptionService,
    public readonly currencyService: CurrencyService,
    private readonly authService: AuthService,
    private readonly pdfService: PdfService,
    private readonly promoCodeService: PromoCodeService
  ) {
    this.paymentForm = this.fb.group({
      promoCode: [''],
      // Card
      cardholderName: [''],
      cardNumber: [''],
      expiryDate: [''],
      cvv: [''],
      saveCard: [false],
      // PayPal
      paypalEmail: [''],
      paypalSubMethod: ['account'], // 'card' | 'account'
      // Mobile
      mobileProvider: ['D17'],
      mobilePhone: [''],
      mobileTransactionCode: [''],
      // Bank Transfer
      bankName: [''],
      rib: [''],
      accountHolder: ['']
    });
  }

  ngOnInit(): void {
    this.startSessionTimer();
    this.loadDraft();
    if (this.selectedPaymentMethod) this.activeMethod = this.selectedPaymentMethod;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPaymentMethod'] && this.selectedPaymentMethod) {
      this.activeMethod = this.selectedPaymentMethod;
    }
  }

  ngOnDestroy(): void {
    if (this.timerId) clearInterval(this.timerId);
    this.saveDraft();
  }

  get basePriceTnd(): number { return this.subscription.priceAtPurchase; }

  get effectivePriceTnd(): number {
    if (this.promoResult?.valid && this.promoResult.discountValue != null) {
      return this.promoCodeService.applyDiscount(this.basePriceTnd, this.promoResult);
    }
    return this.basePriceTnd;
  }

  get discountTnd(): number {
    return Math.max(0, Math.round((this.basePriceTnd - this.effectivePriceTnd) * 100) / 100);
  }

  get convertedAmount(): number { return this.currencyService.convertFromTnd(this.effectivePriceTnd); }

  get cardBrand(): 'visa' | 'mastercard' | 'unknown' {
    const d = (this.paymentForm.get('cardNumber')?.value || '').replace(/\D/g, '');
    if (d.startsWith('4')) return 'visa';
    if (d.startsWith('5') || d.startsWith('2')) return 'mastercard';
    return 'unknown';
  }

  get progressPercent(): number { return (this.currentStep / 4) * 100; }

  private draftKey(): string {
    return `matchy_payment_draft_${this.plan?.id ?? 'plan'}_${this.authService.currentUser?.id ?? 'guest'}`;
  }

  private loadDraft(): void {
    try {
      const raw = sessionStorage.getItem(this.draftKey());
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d.form) this.paymentForm.patchValue(d.form, { emitEvent: false });
      if (d.step >= 1 && d.step <= 4) this.currentStep = d.step;
      if (d.activeMethod) this.activeMethod = d.activeMethod;
    } catch { /* ignore */ }
  }

  saveDraft(): void {
    try {
      sessionStorage.setItem(this.draftKey(), JSON.stringify({
        step: this.currentStep, activeMethod: this.activeMethod, form: this.paymentForm.value
      }));
    } catch { /* ignore */ }
  }

  private startSessionTimer(): void {
    this.sessionEnd = Date.now() + SESSION_MS;
    this.tickTimer();
    this.timerId = setInterval(() => this.tickTimer(), 1000);
  }

  private tickTimer(): void {
    const left = Math.max(0, this.sessionEnd - Date.now());
    if (left <= 0) { this.timerLabel = '0:00'; return; }
    const m = Math.floor(left / 60000);
    const s = Math.floor((left % 60000) / 1000);
    this.timerLabel = `${m}:${s.toString().padStart(2, '0')}`;
  }

  validatePromo(): void {
    const code = this.paymentForm.get('promoCode')?.value || '';
    if (!code.trim()) { this.promoResult = null; this.promoMessage = ''; return; }
    this.promoChecking = true;
    this.promoCodeService.validate(code, String(this.plan.id), this.basePriceTnd).subscribe({
      next: r => { this.promoResult = r; this.promoMessage = r.message; this.promoChecking = false; this.saveDraft(); },
      error: () => { this.promoChecking = false; }
    });
  }

  goStep1Next(): void { this.currentStep = 2; this.saveDraft(); }

  selectMethod(m: PaymentMethod): void { this.activeMethod = m; }

  goStep2Next(): void {
    if (!this.activeMethod) { this.errorMessage = 'Please choose a payment method.'; return; }
    this.errorMessage = '';
    this.applyValidatorsForMethod();
    this.currentStep = 3;
    this.saveDraft();
  }

  goStep3Next(): void {
    this.applyValidatorsForMethod();
    this.paymentForm.updateValueAndValidity({ emitEvent: true });
    if (this.paymentForm.invalid) { this.paymentForm.markAllAsTouched(); return; }
    this.currentStep = 4;
    this.saveDraft();
  }

  goBack(): void {
    this.errorMessage = '';
    if (this.currentStep > 1) { this.currentStep = (this.currentStep - 1) as 1 | 2 | 3 | 4; this.saveDraft(); }
  }

  private applyValidatorsForMethod(): void {
    Object.keys(this.paymentForm.controls).forEach(key => {
      if (key !== 'promoCode') this.paymentForm.get(key)?.clearValidators();
    });
    if (this.activeMethod === 'CARD') {
      this.paymentForm.get('cardholderName')?.setValidators([Validators.required, Validators.minLength(3)]);
      this.paymentForm.get('cardNumber')?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
      this.paymentForm.get('expiryDate')?.setValidators([Validators.required]);
      this.paymentForm.get('cvv')?.setValidators([Validators.required]);
    } else if (this.activeMethod === 'PAYPAL') {
      this.paymentForm.get('paypalEmail')?.setValidators([Validators.required, Validators.email]);
    } else if (this.activeMethod === 'MOBILE') {
      this.paymentForm.get('mobileProvider')?.setValidators([Validators.required]);
      this.paymentForm.get('mobilePhone')?.setValidators([Validators.required]);
    } else if (this.activeMethod === 'BANK_TRANSFER') {
      this.paymentForm.get('bankName')?.setValidators([Validators.required]);
      this.paymentForm.get('rib')?.setValidators([Validators.required]);
      this.paymentForm.get('accountHolder')?.setValidators([Validators.required, Validators.minLength(3)]);
    }
    Object.keys(this.paymentForm.controls).forEach(key => {
      this.paymentForm.get(key)?.updateValueAndValidity({ emitEvent: false });
    });
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').substring(0, 16);
    this.paymentForm.get('cardNumber')?.setValue(digits, { emitEvent: true });
    input.value = digits.replace(/(.{4})/g, '$1 ').trim();
  }

  formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').substring(0, 4);
    if (value.length >= 2) value = value.substring(0, 2) + '/' + value.substring(2);
    this.paymentForm.get('expiryDate')?.setValue(value, { emitEvent: true });
    input.value = value;
  }

  downloadInvoicePreview(): void {
    const ref = this.lastResponse?.transactionRef || this.lastResponse?.transactionId || 'PREVIEW';
    this.pdfService.downloadInvoice({
      invoiceId: 'INV-' + ref.slice(-8),
      clientName: this.authService.currentUser?.name || 'Client',
      clientEmail: this.authService.currentUser?.email || '—',
      planName: String(this.plan.name),
      amountTnd: this.effectivePriceTnd,
      amountOriginal: this.convertedAmount,
      currency: this.currencyService.getCurrency(),
      durationMonths: this.subscription.duration || 1,
      periodStart: new Date(this.subscription.startDate).toLocaleDateString('en-US'),
      periodEnd: new Date(this.subscription.endDate).toLocaleDateString('en-US'),
      paymentMethod: this.activeMethod || '—',
      transactionRef: ref,
      paid: false
    });
  }

  onSubmit(): void {
    if (!this.activeMethod) return;
    this.applyValidatorsForMethod();
    if (this.paymentForm.invalid) { this.paymentForm.markAllAsTouched(); return; }

    this.isLoading = true;
    this.errorMessage = '';
    const v = this.paymentForm.value;
    const userId = this.authService.currentUser?.id != null ? String(this.authService.currentUser.id) : 'guest';

    const payment: Payment = this.subscriptionService.buildPayment(this.subscription, {
      method: this.activeMethod,
      amountOriginalTnd: this.effectivePriceTnd,
      cardNumber: v.cardNumber,
      expiryDate: v.expiryDate,
      cvv: v.cvv,
      cardholderName: v.cardholderName,
      paypalEmail: v.paypalEmail,
      mobileProvider: v.mobileProvider,
      mobilePhone: v.mobilePhone,
      mobileTransactionCode: v.mobileTransactionCode,
      bankName: v.bankName,
      rib: v.rib,
      accountHolder: v.accountHolder,
      promoCode: v.promoCode?.trim() || undefined,
      discountAmountTnd: this.discountTnd > 0 ? this.discountTnd : undefined
    });

    this.subscriptionService.processPayment(payment, userId).subscribe({
      next: (response: PaymentResponse) => {
        this.isLoading = false;
        if (response.success) {
          this.lastResponse = response;
          this.showSuccessModal = true;
          if (this.plan?.id != null) {
            this.subscriptionService.markPlanAsCurrent(String(this.plan.id));
          }
          this.paymentSuccess.emit(response);
          sessionStorage.removeItem(this.draftKey());
        } else {
          this.errorMessage = response.message || 'Payment failed.';
        }
      },
      error: () => { this.isLoading = false; this.errorMessage = 'Network error. Please try again.'; }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const f = this.paymentForm.get(fieldName);
    return !!(f && f.invalid && (f.dirty || f.touched));
  }

  fieldError(fieldName: string): string {
    const f = this.paymentForm.get(fieldName);
    if (!f || !f.errors || (!f.dirty && !f.touched)) return '';
    if (f.errors['required']) return 'Required field';
    if (f.errors['email']) return 'Invalid email address';
    if (f.errors['pattern']) return 'Card number must be 16 digits';
    return 'Invalid';
  }

  onDashboard(): void { this.showSuccessModal = false; this.close.emit(); }
}
