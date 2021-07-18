import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-delivery-status',
  templateUrl: './delivery-status.component.html',
  styleUrls: ['./delivery-status.component.css']
})
export class DeliveryStatusComponent implements OnInit {
  public unaccepted: boolean = true;
  public accepted: boolean = false;
  public kitchen: boolean = false;
  public way: boolean = false;
  public delivered: boolean = false;

  public status: any = null;
  public orderCreatedOn: string;
  public orderId: string;
  constructor(private route: ActivatedRoute, private menuService: MenuService) { }

  ngOnInit(): void {
    this.getOrderStatus()
  }

  public getOrderStatus() {
    this.orderId = this.route.snapshot.paramMap.get('orderId')
    this.menuService.GetOrderStatus(this.orderId)
      .subscribe((res) => {
        this.status = res[0]['Order_Status'];
        this.orderCreatedOn = new Date(res[0]['Created_On']).toLocaleDateString();
        this.setOrderFlow();
      }, (err) => {
        console.log(err);
      })
  }

  setOrderFlow() {
    if (this.status == "U") {
      document.getElementById("step1").classList.add("unaccept");
    }
    else if (this.status == "A") {
      this.accepted = true;
    } else if (this.status == "K") {
      this.accepted = true;
      this.kitchen = true;
    } else if (this.status == "W") {
      this.accepted = true;
      this.kitchen = true;
      this.way = true;
    } else if (this.status == "D") {
      this.accepted = true;
      this.kitchen = true;
      this.way = true;
      this.delivered = true;
    }
  }

}
