import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { FormService } from 'src/app/services/form.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(private formService: FormService, private adminService: AdminService, private router: Router, private toast: ToastrService) { }

  ngOnInit(): void {
    this.loginForm = this.formService.AdminLoginForm;
  }

  adminLogin() {
    const key = environment.encryptKey;

    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(this.loginForm.value), key).toString();

    this.adminService.AdminLogin(encryptedData)
      .subscribe((res) => {
        this.router.navigate(['/admin/currentorder']);
        window.localStorage.setItem("token", encryptedData);
      }, (err) => {
        console.log(err);
        if (err && err.status == 404) {
          this.toast.error("User & Password Not Matched", "", { timeOut: 3000 })
        }
      })
  }

}
