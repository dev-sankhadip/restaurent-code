import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

  public orderId: string;
  public selectedOrderDetails: Array<object> = null;
  public orderStatus = null;
  public unacptReason = null;
  public curOrderStatus: string;
  public selectedOrderStatus: string;
  public selectedUnacptReason: string = null;

  constructor(private menuService: MenuService, private adminService: AdminService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.getOrderStatus();
    this.getUnacceptReason();
  }

  setOrderDetails(selectedOrderDetails, orderId) {
    this.selectedOrderDetails = selectedOrderDetails;
    this.orderId = orderId;
    if (selectedOrderDetails)
      this.curOrderStatus = selectedOrderDetails[0].Order_Status;
    this.selectedOrderStatus = this.curOrderStatus;
  }

  getOrderDet(prop: string) {
    return this.selectedOrderDetails ? this.selectedOrderDetails[0][prop] ?? "--" : "--";
  }

  getOrderStatus() {
    this.menuService.GetLookupValues(["Order_Status"])
      .subscribe((res) => {
        this.orderStatus = res['Order_Status'].filter(status => status[1] != 'C');
      }, (err) => {
        console.log(err);
      })
  }

  getUnacceptReason() {
    this.menuService.GetLookupValues(["Unacpt_Reason"])
      .subscribe((res) => {
        this.unacptReason = res['Unacpt_Reason'];
      }, (err) => {
        console.log(err);
      })
  }

  updateOrder() {
    let errorMessage = [];
    if (this.selectedOrderStatus == 'U' && !this.selectedUnacptReason) {
      errorMessage.push("Please Select Reason for Unaccepting");
    }
    errorMessage.map((msg) => {
      this.toast.error(msg, "", { timeOut: 2000 });
    })
    if (errorMessage.length == 0) {
      this.adminService.UpdateOrderStatus(this.orderId, this.selectedOrderStatus, this.selectedUnacptReason)
        .subscribe((res) => {
          this.toast.success("Order Updated", "", { timeOut: 2000 });
          this.adminService.notifyRefreshCurrentOrder(this.orderId);
        }, (err: HttpErrorResponse) => {
          if (err.status == 403) {
            err.error.err_msg.map((msg) => {
              this.toast.error(msg, "Validation Error", { timeOut: 2000 });
            })
            return;
          }
          if (err.error.msg)
            this.toast.error(err.error.msg, "", { timeOut: 2000 });
          else
            this.toast.error("Internal Server Error", "", { timeOut: 2000 });
        })
    }
  }

}
