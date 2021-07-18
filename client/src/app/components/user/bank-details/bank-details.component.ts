import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MenuService } from 'src/app/services/menu.service';
import { NgxUiLoaderService } from "ngx-ui-loader";

declare var stripe: any;
declare var elements: any;
declare var $: any;
@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.css']
})
export class BankDetailsComponent implements OnInit {

  public orderAmount: string = null;
  public auBankAccount;
  public errorMessage: string = null;
  public paymentDetails = {
    name: "",
    email: ""
  }
  public orderDetails: any;
  public IsPaymentProcessing: boolean = false;
  public PaymentStatusInterval;
  public PI: string;
  public orderId: string;
  public loaderMsg = "Payment processing. Please Don't Leave page";

  @Input()
  set amount(val: string) {
    this.orderAmount = val;
  }


  constructor(private menuService: MenuService, private toast: ToastrService, private router: Router, private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.auBankAccount = this.setupElements();
  }

  doPayment(event) {
    event.preventDefault();
    if (!document.getElementsByTagName("form")[0].reportValidity()) {
      // Form not valid, abort
      return;
    }
    const { name, email } = this.paymentDetails;
    if (name == '' || email == '')
      this.toast.error("Please fill up all details", "", { timeOut: 3000 })
    else {
      this.IsPaymentProcessing = true;
      // Create PaymentIntent
      this.createPaymentIntent().then((intent: any) => {
        this.orderId = intent.orderId;
        this.PI = intent.pi;
        this.pay(intent.clientSecret);
      })
        .catch(() => {
          this.IsPaymentProcessing = false;
        })
    }
  }


  // Set up Stripe.js and Elements to use in checkout form
  setupElements() {
    const elements = stripe.elements();
    // Custom styling can be passed to options when creating an Element
    const style = {
      base: {
        color: "#32325d",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        },
        ":-webkit-autofill": {
          color: "#32325d"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
        ":-webkit-autofill": {
          color: "#fa755a"
        }
      }
    };

    const options = {
      style: style,
      disabled: false,
      hideIcon: false,
      iconStyle: "default" // or "solid"
    };

    // Create an instance of the auBankAccount Element.
    const auBankAccount = elements.create("auBankAccount", options);

    // Add an instance of the auBankAccount Element into
    // the `au-bank-account-element` <div>.
    auBankAccount.mount("#au-bank-account-element");

    auBankAccount.on("change", (event) => {
      // Reset error state
      // document.getElementById("error-message").classList.remove("visible");
      this.errorMessage = null;
      // Display bank name corresponding to auBankAccount, if available.
      const bankName = document.getElementById("bank-name");
      if (event.bankName && event.branchName) {
        bankName.textContent = `${event.bankName} (${event.branchName})`;
        bankName.classList.add("visible");
      } else if (event.bankName) {
        bankName.textContent = `${event.bankName}`;
        bankName.classList.add("visible");
      } else {
        bankName.classList.remove("visible");
      }
      // Handle real-time validation errors from the Element.
      if (event.error) {
        this.showError(event.error.message);
      }
    });

    return auBankAccount;
  };

  showError(errorMsgText) {
    this.errorMessage = errorMsgText;
  };

  pay(clientSecret) {
    const { name, email } = this.paymentDetails;
    let auBankAccount = this.auBankAccount;
    stripe
      .confirmAuBecsDebitPayment(clientSecret, {
        payment_method: {
          au_becs_debit: auBankAccount,
          billing_details: {
            name, email
          }
        }
      })
      .then((result) => {
        this.IsPaymentProcessing = false;
        const { error, paymentIntent } = result;
        if (error) {
          // Show error to your customer
          this.showError(error.message);
        } else if (paymentIntent) {
          this.orderComplete(paymentIntent);
        } else {
          this.showError("An unexpected error occured.");
        }
      });
  };

  /* Shows a success / error message when the payment is complete */
  orderComplete(payment) {
    let resMsg;
    if (payment.status == 'succeeded') {
      resMsg = "Order has been placed";
    }
    if (payment.status == "processing") {
      resMsg = "Payment processing. Order Status will be updated.";
      this.ngxService.startLoader("loader-01");
      this.PaymentStatusInterval = setInterval(() => { this.CheckPaymentStatus(); }, 2000);
    }
    this.toast.success(resMsg, "Successful", { timeOut: 2000 });
  };

  createPaymentIntent() {
    return new Promise((resolve, reject) => {
      const { name, email } = this.paymentDetails;

      this.menuService.CreatePaymentIntent(name, email, this.orderDetails)
        .subscribe((res) => {
          resolve(res);
        })
    })
  };

  CheckPaymentStatus = () => {
    this.menuService.GetPaymentStatus(this.PI, this.orderId)
      .subscribe((res) => {
        if (res[0].Webhook_Name.split(',').includes("payment_intent.succeeded")) {
          this.toast.success("Payment Successful", "Successful", { timeOut: 3000 });
          this.AfterPaymentUpdate();
        }
        if (res[0].Webhook_Name.split(',').includes("payment_intent.payment_failed")) {
          this.toast.error("Payment Failed. Please try again", "Failed", { timeOut: 3000 });
          this.AfterPaymentUpdate();
        }
      }, (err) => {
        console.log(err);
        this.AfterPaymentUpdate();
      })
  }

  AfterPaymentUpdate = () => {
    clearInterval(this.PaymentStatusInterval);
    $("#bankPaymentModal").modal("hide");
    this.router.navigate(['/menu'])
    this.ngxService.stopLoader("loader-01");
  }

  setOrderDetails(orderDetails) {
    this.orderDetails = orderDetails;
  }



}
