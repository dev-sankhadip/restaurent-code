import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-timings',
  templateUrl: './timings.component.html',
  styleUrls: ['./timings.component.css']
})
export class TimingsComponent implements OnInit {

  public timingForm: FormGroup;
  constructor(private formService: FormService, private adminService: AdminService, private toast: ToastrService) { }

  ngOnInit(): void {
    this.timingForm = this.formService.TimingForm;
    this.adminService.GetTodaySchedule()
      .subscribe((res) => {
        this.timingForm.patchValue({
          openTime: res[0].time.split("-")[0],
          endTime: res[0].time.split("-")[1],
          day: new Date().getDay(),
          month: new Date().getMonth() + 1
        })
      }, (err) => {
        console.log(err);
      })
  }

  setTime() {
    const { openTime, endTime } = this.timingForm.value;
    let errMsg = [];
    if (openTime == "")
      errMsg.push("Please Select Opening time")
    if (endTime == "")
      errMsg.push("Please Select Closing time")
    if (errMsg.length == 0) {
      if (endTime < openTime) {
        errMsg.push("Closing Time can't be less then Opening Time")
      }
      else {
        this.adminService.SetRestaurentTime(this.timingForm.value)
          .subscribe((res) => {
            console.log(res);
            this.toast.success("Time Updated", "Successful", { timeOut: 3000 })
          }, (err) => {
            console.log(err);
          })
        return;
      }
    }
    errMsg.map((msg) => {
      this.toast.error(msg, "", { timeOut: 3000 })
    })
  }

}
