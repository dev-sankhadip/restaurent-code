import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {

  public UserOrders = null;
  public BackUserOrders = null;
  public orderIds = null;
  public BackupOrderIds = null;
  public IsAdmin: boolean = false;
  public LookupValues: any = null;
  public searchValue = {
    orderId: null,
    createdOn: null,
    status: '',
    IsRefund: false
  }

  constructor(private menuService: MenuService,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private toast: ToastrService
  ) { }
  ngOnDestroy(): void {
  }


  ngOnInit(): void {
    if (this.router.url == '/admin/pastorder') {
      this.IsAdmin = true;
      document.getElementById("main-container").classList.add("wraper")
      this.getAdminAllPastOrders();
      this.getLookupValues();
    }
    if (this.router.url == '/orders') {
      if (this.route.snapshot.data['IsLoggedIn'])
        this.getUserOrders();
      else
        this.router.navigate(['/'])
    }
  }

  getUserOrders() {
    this.menuService.GetUserOrder()
      .subscribe((res) => {
        if (res) {
          let orderIds: any = Object.keys(res);
          this.orderIds = orderIds.sort((a, b) => { return a.split(',')[1] - b.split(',')[1] });
          this.BackupOrderIds = this.orderIds;
          this.UserOrders = res;
          this.BackUserOrders = res;
        }
      }, (err) => {
        console.log(err);
      })
  }

  getAdminAllPastOrders() {
    this.adminService.GetAllPastOrders()
      .subscribe((res) => {
        let orderIds: any = Object.keys(res);
        this.orderIds = orderIds.sort((a, b) => { return a.split(',')[1] - b.split(',')[1] });
        this.BackupOrderIds = this.orderIds;
        this.UserOrders = res;
        this.BackUserOrders = res;
      }, (err) => {
        console.log(err);
      })
  }

  getOrderDetails(orderId: string, prop: string, type = null) {
    if (!this.UserOrders)
      return "--"
    else {
      let data = this.BackUserOrders[orderId][0][prop];
      return type ? new Date(data).toDateString() : data;
    }
  }

  RefundOrder(orderIdObj: string) {
    const orderId = orderIdObj.split(',')[0]
    var r = confirm(`Do you want to refund Order ${orderId}? Process can't be undone`);
    if (r == true) {
      const payMethod = this.getOrderDetails(orderIdObj, 'Pay_Method');
      this.adminService.RefundDeliveredOrder(orderId, payMethod)
        .subscribe((res) => {
          this.toast.success("Order Refunded", "Successful", { timeOut: 3000 })
          this.getAdminAllPastOrders();
        }, (err: HttpErrorResponse) => {
          if (err.error.msg) {
            this.toast.error(err.error.msg, "", { timeOut: 3000 })
            return;
          }
          this.toast.error("Order Not Refunded, Please try after sometime", "", { timeOut: 3000 })
        })
    }
  }

  getLookupValues() {
    this.menuService.GetLookupValues()
      .subscribe((res) => {
        this.LookupValues = res;
      }, (err) => {
        console.log(err);
      })
  }

  getLookupValueByCategory(lookup_cat: string) {
    return this.LookupValues[lookup_cat];
  }


  SearchOrder(event, prop) {
    const updatedKeys = Object.keys(this.searchValue).filter((item) => {
      if (this.searchValue[item]) {
        return true
      }
      return false;
    })

    this.FilterId(updatedKeys);
  }

  FilterId(keys) {
    let tempOrderIds = this.BackupOrderIds;
    if (keys.includes('orderId')) {
      tempOrderIds = this.BackupOrderIds.filter((id) => {
        if (this.searchValue['orderId'].toUpperCase() == id.split(",")[0]) {
          return true;
        }
        return false;
      })
      this.FilterValues(keys, tempOrderIds);
    }
    else {
      this.FilterValues(keys, tempOrderIds);
    }
  }

  async FilterValues(keys, orderIds) {
    let filteredOrderIds = orderIds;

    await keys.map((key) => {
      if (key == 'createdOn') {
        filteredOrderIds = filteredOrderIds.filter((id) => {
          if (new Date(this.searchValue[key]).toDateString() == new Date(id.split(",")[1]).toDateString()) {
            return true;
          }
          return false;
        })
      }
      if (key == 'status') {
        filteredOrderIds = filteredOrderIds.filter((id) => {
          // console.log(this.getOrderDetails(id, 'Order_Status'));
          // console.log(this.searchValue[key]);
          if (this.getOrderDetails(id, 'Order_Status') == this.searchValue[key]) {
            return true;
          }
          return false;
        })
      }
      if (key == 'IsRefund') {
        filteredOrderIds = filteredOrderIds.filter((id) => {
          // console.log(this.getOrderDetails(id, 'IsRefund'));
          // console.log(this.searchValue[key]);
          if ((this.getOrderDetails(id, 'IsRefund') > 0) == this.searchValue[key]) {
            return true;
          }
          return false;
        })
      }
    })
    this.orderIds = filteredOrderIds.sort((a, b) => { return a.split(',')[1] - b.split(',')[1] });
    // this.UserOrders = res;
    // console.log(this.UserOrders)
    this.UserOrders = {};
    filteredOrderIds.map((id) => {
      this.UserOrders[id] = this.BackUserOrders[id];
    })

    // console.log(filteredOrderIds);
  }

}
