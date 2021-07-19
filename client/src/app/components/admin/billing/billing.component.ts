import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { CSVColumns } from 'src/app/VO/constants';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit {

  public billingDetails = null;
  public backupBillingDetails = null;
  public yearList = [];
  public searchValue = {
    month: -1,
    year: -1
  }

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.setYearFilter();
    this.getBillingDetails();
  }
  setYearFilter() {
    let runningYear = new Date().getFullYear();
    while (runningYear >= 2021) {
      this.yearList.push(runningYear);
      runningYear = -2021;
    }
  }

  getBillingDetails() {
    this.adminService.GetBillingDetails()
      .subscribe((res) => {
        console.log(res);
        this.billingDetails = res;
        this.backupBillingDetails = res;
      }, (err) => {
        console.log(err);
      })
  }

  formatDate(dateInput) {
    return new Date(dateInput).toDateString();
  }

  async FilterValues() {
    const keys = Object.keys(this.searchValue).filter((item) => {
      if (this.searchValue[item] != -1) {
        return true
      }
      return false;
    })
    let billingDetails = this.backupBillingDetails;

    await keys.map((key) => {
      if (key == 'month') {
        billingDetails = billingDetails.filter((det) => {
          if (this.searchValue[key] == new Date(det.Created_On).getMonth()) {
            return true;
          }
          return false;
        })
      }
      if (key == 'year') {
        billingDetails = billingDetails.filter((det) => {
          if (this.searchValue[key] == new Date(det.Created_On).getFullYear()) {
            return true;
          }
          return false;
        })
      }
    })

    this.billingDetails = billingDetails;
  }

  ExportBilling() {
    const replacer = (key, value) => (value === null ? '' : value);
    const header = CSVColumns;
    const csv = this.billingDetails.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    );

    // console.log(header);

    // console.log(csv);
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');

    // console.log(csvArray);

    const a = document.createElement('a');
    const blob = new Blob([csvArray], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = 'myFile.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

}
