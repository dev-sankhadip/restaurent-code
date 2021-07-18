import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { FormService } from 'src/app/services/form.service';
import { MenuService } from 'src/app/services/menu.service';
import { PaymentChargeComponent } from '../payment-charge/payment-charge.component';
declare var $: any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  public cartForm: any = new FormGroup({ items: new FormArray([]) });;
  public IsCartItem: boolean = false;
  public subTotal: number = 0.00;
  @ViewChild(PaymentChargeComponent) private paymentChargeComponent: PaymentChargeComponent;

  constructor(private menuService: MenuService, private formService: FormService, private toast: ToastrService, private route: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.menuService.obsr_CartShow.subscribe(() => {
      this.getCartItems();
    })
  }

  getCartItems() {
    this.cartForm = new FormGroup({ items: new FormArray([]) });
    let TempCartForm: any = new FormGroup({ items: new FormArray([]) });
    this.subTotal = 0.00;
    this.menuService.GetCartItems()
      .subscribe(async (res) => {
        $("#cartModal").modal("show");
        if (res != null) {
          const promise = res.map((item, index) => {
            let menuItemForm = this.formService.CartForm;
            menuItemForm.patchValue({
              cat_id: item.Cat_Id,
              menu_id: item.Menu_Id,
              name: item.Menu_Name,
              qty: item.Menu_Qty,
              price: item.Menu_Price
            })
            TempCartForm.get("items").push(menuItemForm);
          })
          await Promise.all(promise);
          this.cartForm = TempCartForm;
          this.calculateSubTotal();
          if (res.length > 0) {
            this.IsCartItem = true;
          }
        }
        else {
          this.IsCartItem = false;
        }
      }, (err) => {
        console.log(err);
        if (err.status == 401 || err.status == 400) {
          this.authService.notifyResetSignupComponent();
          $("#signupModal").modal("show");
        }
      })
  }

  calculateSubTotal() {
    this.subTotal = 0.00;
    this.cartForm.get('items').controls.forEach((item) => {
      this.subTotal += item.controls.qty.value * item.controls.price.value;
    })
    if (this.cartForm.get('items').controls.length == 0) {
      this.IsCartItem = false;
    }
    this.subTotal = parseFloat(this.subTotal.toFixed(2));
  }

  updateCartItem(control: FormGroup, index: number) {
    this.menuService.UpdateCartItems({ ...control.value })
      .subscribe((res) => {
        if (control.value.qty == 0) {
          this.cartForm.get("items").controls.splice(index, 1);
        }
        this.calculateSubTotal();
      }, (err) => {
        console.log(err);
        if (err.status != 403)
          this.toast.error("Error while updating cart", "Error", { timeOut: 3000 });
      })
  }

  removeItemFromCart(menu_id: string, index: number) {
    this.menuService.RemoveCartItem(menu_id)
      .subscribe((res) => {
        this.cartForm.get("items").controls.splice(index, 1);
        this.calculateSubTotal();
        this.toast.success("Item Removed from Cart", "Successful", { timeOut: 3000 });
      }, (err) => {
        if (err.status != 403)
          this.toast.error(err, "Error", { timeOut: 3000 });
      })
  }

  hideCartModal() {
    $("#cartModal").modal("hide");
    this.route.navigate(['/checkout']);
  }

}
