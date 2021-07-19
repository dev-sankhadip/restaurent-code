import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';

declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private restuCloseSub: Subscription;
  public IsRestuClosed: boolean = false;
  public openTime;
  public closeTime;
  private sub_IsAdmin: Subscription;
  public IsAdmin: boolean = false;
  public IsAdminLoggedIn: boolean = false;

  collapse() {
    $('.navbar-collapse').collapse('hide');
  }

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.restuCloseSub = this.authService.restuClose.subscribe((IsClosed) => {
      this.IsRestuClosed = !<boolean>IsClosed['IsOpen'][0];
      if (IsClosed['IsOpen'][2] > "12:00") {
        let tempHr = Number(IsClosed['IsOpen'][2].toString().split(":")[0]);
        let tempMin = Number(IsClosed['IsOpen'][2].toString().split(":")[1]);
        let hr = tempHr - 12 < 10 ? "0" + (tempHr - 12) : tempHr - 12;
        let min = tempMin < 10 ? "0" + tempMin : tempMin;
        this.closeTime = hr + ":" + min;
      }
      else {
        let tempHr = Number(IsClosed['IsOpen'][2].toString().split(":")[0]);
        let tempMin = Number(IsClosed['IsOpen'][2].toString().split(":")[1]);
        let hr = tempHr < 10 ? "0" + tempHr : tempHr;
        let min = tempMin < 10 ? "0" + tempMin : tempMin;
        this.closeTime = hr + ":" + min;
      }

      if (IsClosed['IsOpen'][1] > "12:00") {
        let tempHr = Number(IsClosed['IsOpen'][1].toString().split(":")[0]);
        let tempMin = Number(IsClosed['IsOpen'][1].toString().split(":")[1]);
        let hr = tempHr - 12 < 10 ? "0" + (tempHr - 12) : tempHr - 12;
        let min = tempMin < 10 ? "0" + tempMin : tempMin;
        this.openTime = hr + ":" + min;
      }
      else {
        let tempHr = Number(IsClosed['IsOpen'][1].toString().split(":")[0]);
        let tempMin = Number(IsClosed['IsOpen'][1].toString().split(":")[1]);
        let hr = tempHr < 10 ? "0" + tempHr : tempHr;
        let min = tempMin < 10 ? "0" + tempMin : tempMin;
        this.openTime = hr + ":" + min;
      }
    })

    this.sub_IsAdmin = this.authService.obsr_IsAdmin.subscribe((res) => {
      this.IsAdmin = res[0];
      this.IsAdminLoggedIn = res[1]
    })
  }

  ngOnDestroy() {
    this.restuCloseSub.unsubscribe();
    this.sub_IsAdmin.unsubscribe();
  }

  onActivate(event) {
    window.scroll(0, 0);
    $("#paymentModal").modal("hide");
    $("#cartModal").modal("hide");
  }
}
