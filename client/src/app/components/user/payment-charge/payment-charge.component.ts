import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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

  card: any;
  cardHandler = this.onChange.bind(this);
  cardError: string;

  constructor(private cd: ChangeDetectorRef, private menuService: MenuService, private toast: ToastrService, private router: Router) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.card) {
      // We remove event listener here to keep memory clean
      this.card.removeEventListener('change', this.cardHandler);
      this.card.destroy();
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
  async createStripeToken() {
    const { token, error } = await stripe.createToken(this.card);
    if (token) {
      this.onSuccess(token);
    } else {
      this.onError(error);
    }
  }
  onSuccess(token) {
    this.menuService.CheckOutCart(token.id, this.orderDetails)
      .subscribe((res) => {
        this.toast.success(res.msg, "Successful", { timeOut: 3000 });
        $("#paymentModal").modal("hide");
        this.router.navigate([`/order-status/${res.orderId}`])
      }, (err: HttpErrorResponse) => {
        if (err.status == 400) {
          if (Array.isArray(err.error)) {
            err.error.map((msg) => {
              this.toast.error(`${msg.message}`, "Validation Error", { timeOut: 3000 });
            })
          }
        }
        else if (err.status != 403 && err.status != 500)
          this.toast.error("Error in placing order", "Error", { timeOut: 3000 });
        else if (err.status === 500 && err.error.msg)
          this.toast.error(err.error.msg, "Error", { timeOut: 3000 });
      })
  }
  onError(error) {
    if (error.message) {
      this.cardError = error.message;
    }
  }

  setOrderDetails(orderDetails) {
    this.orderDetails = orderDetails;
  }

}
