import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { OrderDetailsComponent } from '../order-details/order-details.component';

declare var $: any;
@Component({
  selector: 'app-current-order',
  templateUrl: './current-order.component.html',
  styleUrls: ['./current-order.component.css']
})
export class CurrentOrderComponent implements OnInit {

  @ViewChild(OrderDetailsComponent, { static: false }) private orderDetailComponent: OrderDetailsComponent;

  public orderDetails = null;
  public orderIds: Array<string> = [];

  constructor(private adminService: AdminService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.fetchOrderDetails();
    this.adminService.obsr_RefreshCurrentOrder.subscribe((orderId) => {
      this.fetchOrderDetails(() => {
        if (!this.orderDetails)
          this.orderDetailComponent.setOrderDetails(null, null);
        else
          this.showOrderDetail(orderId, event);
      });
    })
  }

  fetchOrderDetails(callback = null) {
    this.adminService.GetOrderDetails()
      .subscribe((res: HttpResponse<any>) => {
        this.orderDetails = res;
        if (this.orderDetails) {
          this.orderIds = Object.keys(this.orderDetails);
        }
      }, (err) => {
        console.log(err);
      }, () => {
        if (callback)
          callback();
      })
  }

  public showOrderDetail(orderId: string, event) {
    this.orderDetailComponent.setOrderDetails(this.orderDetails[orderId], orderId);
    $(".order-item").removeClass("active");
    $("#" + event.srcElement.id).addClass("active");
    $("#" + event.srcElement.orderid).addClass("active");
  }

}
