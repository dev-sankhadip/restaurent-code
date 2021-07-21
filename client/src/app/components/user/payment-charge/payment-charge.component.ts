import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MenuService } from 'src/app/services/menu.service';

declare var stripe: any;
declare var elements: any;
declare var $: any;

@Component({
  selector: 'app-payment-charge',
  templateUrl: './payment-charge.component.html',
  styleUrls: ['./payment-charge.component.css']
})
export class PaymentChargeComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('cardInfo') cardInfo: ElementRef;

  @Input()
  public totalAmount: number;
  public orderDetails: any;
  public PI: string;
  public orderId: string;
  public loaderMsg = "Payment processing. Please Don't Leave page";

  private card: any;
  private cardHandler = this.onChange.bind(this);
  private cardError: string;

  public errorMessage: string = null;
  public IsPaymentProcessing: boolean = false;
  public PaymentStatusInterval;

  constructor(private cd: ChangeDetectorRef, private menuService: MenuService, private toast: ToastrService, private router: Router, private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.destroyCard();
  }

  destroyCard() {
    if (this.card) {
      // We remove event listener here to keep memory clean
      let cardElement = elements.getElement('card');
      cardElement.clear();
    }
  }

  ngAfterViewInit() {
    this.initiateCardElement();
  }

  initiateCardElement() {
    // Giving a base style here, but most of the style is in scss file
    const cardStyle = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    };
    this.card = elements.create('card', { cardStyle });
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
  }

  onChange({ error }) {
    if (error) {
      this.cardError = error.message;
    } else {
      this.cardError = null;
    }
    this.cd.detectChanges();
  }


  // async createStripeToken() {
  //   const { token, error } = await stripe.createToken(this.card);
  //   if (token) {
  //     this.onSuccess(token);
  //   } else {
  //     this.onError(error);
  //   }
  // }

  ProcessPayment() {
    this.createPaymentIntent().then((intent: any) => {
      this.orderId = intent.orderId;
      this.PI = intent.pi;
      this.pay(intent.clientSecret);
    })
  }


  createPaymentIntent() {
    return new Promise((resolve, reject) => {
      const { username: name } = this.orderDetails;
      let email = "sankhdip.2000@gmail.com";

      this.menuService.CreatePaymentIntent(name, email, this.orderDetails)
        .subscribe((res) => {
          resolve(res);
        })
    })
  };

  pay(clientSecret) {
    const { username: name } = this.orderDetails;
    let email = "sankhdip.2000@gmail.com";
    let cardElement = elements.getElement('card');

    stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name, email
          }
        }
      })
      .then((result) => {
        this.IsPaymentProcessing = false;
        const { error, paymentIntent } = result;
        if (error) {
          this.showError(error.message);
        } else if (paymentIntent) {
          this.orderComplete(paymentIntent);
        } else {
          this.showError("An unexpected error occured.");
        }
      });
  };


  orderComplete(payment) {
    let resMsg;
    if (payment.status == 'succeeded') {
      this.toast.success("Order has been placed", "Successful", { timeOut: 2000 });
      this.router.navigate([`/order-status/${this.orderId}`])
    }
    if (payment.status == "pending") {
      this.toast.success("Payment processing. Order Status will be updated.", "", { timeOut: 2000 });
      this.ngxService.startLoader("loader-01");
      this.PaymentStatusInterval = setInterval(() => { this.CheckPaymentStatus(); }, 2000);
    }
    if (payment.status == "failed") {
      this.toast.error("Payment Failed. Please try Again", "Error", { timeOut: 2000 });
      $("#paymentModal").modal("hide");
      this.destroyCard();
    }
  };

  showError(errorMsgText) {
    this.errorMessage = errorMsgText;
    this.toast.error(this.errorMessage, "Payment Failed", { timeOut: 3000 });
    $("#paymentModal").modal("hide");
    this.destroyCard();
  };

  CheckPaymentStatus = () => {
    this.menuService.GetPaymentStatus(this.PI, this.orderId)
      .subscribe((res) => {
        if (res[0].Webhook_Name.split(',').includes("payment_intent.succeeded")) {
          this.toast.success("Payment Successful", "Successful", { timeOut: 3000 });
          this.router.navigate([`/order-status/${this.orderId}`])
          this.AfterPaymentUpdate(true);
        }
        if (res[0].Webhook_Name.split(',').includes("payment_intent.payment_failed")) {
          this.toast.error("Payment Failed. Please try again", "Failed", { timeOut: 3000 });
          this.AfterPaymentUpdate();
        }
      }, (err: HttpErrorResponse) => {
        this.toast.error(err.error.message, "", { timeOut: 3000 });
        this.AfterPaymentUpdate();
      })
  }

  AfterPaymentUpdate = (success = false) => {
    if (!success) {
      $("#paymentModal").modal("hide");
      this.destroyCard();
    }
    clearInterval(this.PaymentStatusInterval);
    this.ngxService.stopLoader("loader-01");
  }


  // onSuccess(token) {
  //   this.menuService.CheckOutCart(token.id, this.orderDetails)
  //     .subscribe((res) => {
  //       this.toast.success(res.msg, "Successful", { timeOut: 3000 });
  //       $("#paymentModal").modal("hide");
  //       this.router.navigate([`/order-status/${res.orderId}`])
  //     }, (err: HttpErrorResponse) => {
  //       if (err.status == 400) {
  //         if (Array.isArray(err.error)) {
  //           err.error.map((msg) => {
  //             this.toast.error(`${msg.message}`, "Validation Error", { timeOut: 3000 });
  //           })
  //         }
  //       }
  //       else if (err.status != 403 && err.status != 500)
  //         this.toast.error("Error in placing order", "Error", { timeOut: 3000 });
  //       else if (err.status === 500 && err.error.msg)
  //         this.toast.error(err.error.msg, "Error", { timeOut: 3000 });
  //     })
  // }
  // onError(error) {
  //   if (error.message) {
  //     this.cardError = error.message;
  //   }
  // }

  setOrderDetails(orderDetails) {
    this.orderDetails = orderDetails;
    if (!this.card)
      this.initiateCardElement();
  }

}
