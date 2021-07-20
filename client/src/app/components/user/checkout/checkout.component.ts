import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { FormService } from 'src/app/services/form.service';
import { MenuService } from 'src/app/services/menu.service';
import { BankDetailsComponent } from '../bank-details/bank-details.component';
import { PaymentChargeComponent } from '../payment-charge/payment-charge.component';


declare var $: any;
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  @ViewChild('primaryNumber') primaryNumber: ElementRef;
  @ViewChild(PaymentChargeComponent, { static: false }) paymentChargeComponent: PaymentChargeComponent;
  @ViewChild(BankDetailsComponent, { static: false }) bankDetailsComponent: BankDetailsComponent;


  public IsSec: boolean = false;
  public IsUserLoggedin: boolean;
  public LookupValues: any = null;
  public CheckOutForm: FormGroup;
  public cartForm: any = new FormGroup({ items: new FormArray([]) });
  public subTotal: string;
  public DeliveryChargeList: any = null;
  public deliveryCharge: number = 0.00;
  public grandTotal: string = "0.00";
  private sub_UserLoggedInOrOut: Subscription;
  public IsCartItem: boolean = true;
  public oldAddressShow: boolean = true;
  public savedAddressList = null
  public minOrderAmountList = null;

  constructor(private router: Router, private authService: AuthService, private menuService: MenuService, private formService: FormService, private toast: ToastrService,) { }

  ngOnInit(): void {
    this.CheckOutForm = this.formService.CheckOutForm;
    this.CheckOutForm.patchValue({ username: this.getUserDetails('name') })
    this.sub_UserLoggedInOrOut = this.authService.obsr_UserLoggedInOrOut.subscribe((res: boolean) => {
      this.IsUserLoggedin = res;
      if (!this.IsUserLoggedin) {
        this.router.navigate(['/']);
      }
    })
    this.subscriveToValuChanges();
    this.getLookupValues();
    this.getCartItems();
    this.getLookupConfig('charge');
    this.getLookupConfig('order');
    this.GetAddressListOfUser();
  }

  GetMinimumOrderAmount() {

  }

  GetAddressListOfUser() {
    this.menuService.GetAddressListOfUser()
      .subscribe((res) => {
        this.savedAddressList = res;
        if (!res) {
          this.oldAddressShow = false;
        }
        this.SetSavedAddress();
      }, (err) => {

      })
  }

  SetSavedAddress() {
    if (this.savedAddressList) {
      this.CheckOutForm.patchValue({
        addrId: this.savedAddressList[0].Addr_Id,
        deliveryArea: this.savedAddressList[0].Delivery_Area,
      })
    }
  }

  getUserDetails(prop: string) {
    const user = window.localStorage.getItem("user");
    return user ? JSON.parse(window.localStorage.getItem("user"))[prop] : "--"
  }


  ngOnDestroy() {
    this.sub_UserLoggedInOrOut.unsubscribe();
  }

  getLookupValues() {
    this.menuService.GetLookupValues()
      .subscribe((res) => {
        this.LookupValues = res;
      }, (err) => {
        console.log(err);
      })
  }

  getLookupConfig(type: string) {
    this.menuService.getDeliveryChargeList(type)
      .subscribe((res) => {
        if (type == 'charge') {
          this.DeliveryChargeList = res;
          this.calculateDeliveryCharge();
        }
        if (type == 'order') {
          this.minOrderAmountList = res;
        }
      }, (err) => {
        console.log(err);
      })
  }

  getLookupValueByCategory(lookup_cat: string) {
    return this.LookupValues[lookup_cat];
  }

  addSecondaryNumber() {
    this.IsSec = !this.IsSec;
  }

  changeAddressType() {
    this.oldAddressShow = !this.oldAddressShow;
    if (!this.oldAddressShow)
      this.CheckOutForm.patchValue({ addrId: null, deliveryArea: 'SH' })
    else
      this.SetSavedAddress();
  }

  placeOrder() {
    let errorMessage = [];
    let minOrderAmountForAPlace;
    const secNumberElem = document.getElementById("sec-number") as HTMLInputElement;
    const { orderType, fullAddr, zipCode, landmark, paymentMethod, addrId, deliveryArea } = this.CheckOutForm.value;
    if (orderType == 'D') {
      if (!this.oldAddressShow) {
        if (!fullAddr) {
          errorMessage.push("Please enter Full Address")
        }
        if (!zipCode) {
          errorMessage.push("Please enter ZipCode")
        }
        if (!landmark) {
          errorMessage.push("Please enter Landmark")
        }
        minOrderAmountForAPlace = this.CheckForMinimumOrderAmountCheck(deliveryArea);
        if (Number(this.grandTotal) < Number(minOrderAmountForAPlace[0].Config_Value)) {
          errorMessage.push(`Minimum Order Amount is $${minOrderAmountForAPlace[0].Config_Value}`)
        }
      }
      if (this.oldAddressShow) {
        if (!addrId) {
          errorMessage.push("Please Select Address")
        }
        else {
          minOrderAmountForAPlace = this.CheckForMinimumOrderAmountCheck(addrId);
          if (Number(this.grandTotal) < Number(minOrderAmountForAPlace[0].Config_Value)) {
            errorMessage.push(`Minimum Order Amount is $${minOrderAmountForAPlace[0].Config_Value}`)
          }
        }
      }
    }
    if (secNumberElem) {
      let IsNumber = new RegExp('^[0-9]+$').test(secNumberElem.value)
      IsNumber ? "" : errorMessage.push("Invalid Secondary No");
      if (secNumberElem.value.length < 10 && IsNumber) {
        errorMessage.push("Secondary No must be 10 characters long");
      }
    }
    errorMessage.map((msg) => {
      this.toast.error(msg, "", { timeOut: 3000 });
    })
    if (errorMessage.length == 0) {
      const countryCode = document.getElementById("country-code") as HTMLInputElement;
      let secPhoneNumber = secNumberElem ? `${countryCode.value}${secNumberElem.value}` : null;
      if (paymentMethod == 'C') {
        this.paymentChargeComponent.setOrderDetails({ ...this.CheckOutForm.value, secPhoneNumber });
        $("#paymentModal").modal("show");
      }
      if (paymentMethod == 'B') {
        this.bankDetailsComponent.setOrderDetails({ ...this.CheckOutForm.value, secPhoneNumber });
        $("#bankPaymentModal").modal("show");
      }
    }
  }

  CheckForMinimumOrderAmountCheck(value) {
    let deliveryArea = value;
    if (this.oldAddressShow) {
      deliveryArea = (document.getElementById(value) as HTMLInputElement).value;
    }
    let minOrderAmountForAPlace = this.minOrderAmountList.filter(({ Config_Key, Config_Value }) => {
      if (Config_Key == deliveryArea)
        return true
      return false;
    })
    return minOrderAmountForAPlace;
  }

  UpdateDeliveryChargeOfSavedAddr(addrId) {
    let deliveryArea = (document.getElementById(addrId) as HTMLInputElement).value;
    this.CheckOutForm.patchValue({
      deliveryArea
    })
  }

  getCartItems() {
    this.cartForm = new FormGroup({ items: new FormArray([]) });
    let TempCartForm: any = new FormGroup({ items: new FormArray([]) });
    this.menuService.GetCartItems()
      .subscribe(async (res) => {
        if (res != null) {
          const promise = res.map((item, index) => {
            let menuItemForm = this.formService.CartForm;
            menuItemForm.patchValue({
              cat_id: item.Cat_Id,
              menu_id: item.Menu_Id,
              name: item.Menu_Name,
              qty: item.Menu_Qty,
              price: item.Menu_Price,
              type: item.Menu_Type
            })
            TempCartForm.get("items").push(menuItemForm);
          })
          await Promise.all(promise);
          this.cartForm = TempCartForm;
          this.calculateSubTotal();
        }
        else
          this.IsCartItem = false;
      }, (err) => {
        if (err.status == 401) {
          this.router.navigate(['/']);
        }
      })
  }

  calculateSubTotal() {
    let subTotalTemp = 0.00;
    this.cartForm.get('items').controls.forEach((item) => {
      subTotalTemp += item.controls.qty.value * item.controls.price.value;
    })
    if (this.cartForm.get('items').controls.length == 0) {
      this.IsCartItem = false;
    }
    this.subTotal = subTotalTemp.toFixed(2);
  }

  calculateDeliveryCharge() {
    this.grandTotal = this.subTotal;
    if (this.CheckOutForm.controls.orderType.value == 'D') {
      this.DeliveryChargeList.map((item) => {
        if (item.Config_Key == this.CheckOutForm.controls.deliveryArea.value) {
          this.deliveryCharge = item.Config_Value
          this.grandTotal = (parseFloat(this.deliveryCharge.toString()) + parseFloat(parseFloat(this.subTotal).toFixed(2))).toFixed(2);
        }
      })
    }
  }

  subscriveToValuChanges() {
    this.CheckOutForm.controls.deliveryArea.valueChanges.subscribe((val) => {
      this.calculateDeliveryCharge();
    })
    this.CheckOutForm.controls.orderType.valueChanges.subscribe((val) => {
      this.calculateDeliveryCharge();
    })
  }

  updateCartItem(control: FormGroup, index: number, type: string) {
    if (type == 'sub') {
      this.cartForm.get("items").controls[index].patchValue({ qty: control.value.qty - 1 })
    }
    if (type == 'add') {
      this.cartForm.get("items").controls[index].patchValue({ qty: control.value.qty + 1 })
    }
    this.menuService.UpdateCartItems({ ...this.cartForm.get("items").controls[index].value })
      .subscribe(() => {
        if (control.value.qty == 0) {
          this.cartForm.get("items").controls.splice(index, 1);
        }
        this.calculateSubTotal();
        this.calculateDeliveryCharge();
      }, (err) => {
        console.log(err);
        if (err.status != 403)
          this.toast.error("Error while updating cart", "Error", { timeOut: 3000 });
      })
  }

}
