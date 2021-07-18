import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { FormService } from 'src/app/services/form.service';
import { MenuService } from 'src/app/services/menu.service';
import firebase from '../../../lib/firebase';

declare var $: any;
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @Output() showLogin = new EventEmitter<any>();

  public userForm: FormGroup;
  public LookupValues: any = null;
  public windowRef: any;
  private user: any;
  public IsLogin: boolean = true;
  public IsCodeResent: boolean = false;
  public IsCaptchaVerified: boolean = false;
  public confirmationResult: any;

  constructor(private formService: FormService, private authService: AuthService, private router: Router, private toast: ToastrService, private menuService: MenuService) { }

  ngOnInit(): void {
    this.userForm = this.formService.LoginForm;
    this.windowRef = this.authService.windowRef;
    this.authService.obsr_ResetSignupComponent.subscribe(() => {
      this.resetComponent();
    })
    this.getLookupValues();
  }



  toggleLoginSignup() {
    this.IsLogin = !this.IsLogin;
    this.IsCodeResent = false;
    this.userForm = this.IsLogin ? this.formService.LoginForm : this.formService.SignUpForm;
    this.resetRecaptcha();
    this.onRecaptchaVerifier();
    this.IsCaptchaVerified = false;
  }

  resetComponent() {
    this.IsLogin = true;
    this.IsCodeResent = false;
    this.userForm = this.formService.LoginForm;
    this.resetRecaptcha();
    this.onRecaptchaVerifier();
    this.IsCaptchaVerified = false;
  }

  private onRecaptchaVerifier() {
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'normal',
      'callback': (response) => {
        this.IsCaptchaVerified = true;
        document.getElementById("hidden-box").click();
      },
      'expired-callback': () => {
        this.IsCaptchaVerified = false;
        document.getElementById("hidden-box").click();
      }
    });
    this.windowRef.recaptchaVerifier.render()
      .then((widgetId) => {
        this.windowRef.recaptchaWidgetId = widgetId;
      })
  }

  checkIfUserExist() {
    const countryCode = document.getElementById("country-code-auth") as HTMLInputElement;
    const num = `${countryCode.value}${this.userForm.controls.phoneNo.value}`;
    this.authService.CheckUserExist(num)
      .subscribe((res) => {
        if (this.IsLogin)
          this.sendLoginCode(num);
        else
          this.toast.error("User Already Exists", "", { timeOut: 3000 });
      }, (err) => {
        console.log(err);
        if (this.IsLogin)
          this.toast.error("User Not Found. Please Signup", "", { timeOut: 3000 })
        else
          this.sendLoginCode(num);
      })
  }

  sendLoginCode(num) {
    const appVerifier = this.windowRef.recaptchaVerifier;

    firebase.auth().signInWithPhoneNumber("+" + num, appVerifier)
      .then(result => {
        this.windowRef.confirmationResult = result;
        if (this.windowRef.confirmationResult) {
          this.IsCodeResent = true;
        }
      })
      .catch((error) => {
        this.resetRecaptcha();
        this.toast.error(error.message, "", { timeOut: 3000 })
      });
  }

  private resetRecaptcha() {
    if (this.windowRef.recaptchaVerifier)
      this.windowRef.recaptchaVerifier.clear();
  }

  verifyLoginCode() {
    const otp = document.getElementById("otpInput") as HTMLInputElement;
    if (otp.value == "") {
      this.toast.error("Please Enter OTP", "", { timeOut: 3000 })
      return;
    }
    this.windowRef.confirmationResult
      .confirm(otp.value)
      .then(result => {
        this.user = result.user;
        this.user.getIdToken()
          .then((id) => {
            if (this.IsLogin) {
              this.login(id, result);
            }
            else {
              this.signup(id, result);
            }
          })

      })
      .catch((err) => {
        this.toast.error(err.message, "", { timeOut: 3000 })
      });
  }

  private login(id, result) {
    const countryCode = document.getElementById("country-code-auth") as HTMLInputElement;
    const num = `${countryCode.value}${this.userForm.controls.phoneNo.value}`;
    const refreshtoken = result.user.refreshToken;
    const userData = {
      phone_number: num,
      user_id: this.user.uid,
      refreshtoken
    }
    this.authService.Login(userData).subscribe((res) => {
      // window.localStorage.setItem("aToken", id);
      // window.localStorage.setItem("rToken", result.user.refreshToken);
      // window.localStorage.setItem("user", JSON.stringify(user));
      this.storeUserDetails(id, refreshtoken, res);
      // $("#signupModal").modal("hide");
      // this.authService.notifyLoginStatus(true);
      // this.router.navigate(['/menu']);
    }, (err) => {
      this.toast.error(err.message, "", { timeOut: 3000 })
    })
  }

  private signup(id, result) {
    const countryCode = document.getElementById("country-code-auth") as HTMLInputElement;
    const num = `${countryCode.value}${this.userForm.controls.phoneNo.value}`;
    const refreshtoken = result.user.refreshToken;
    const userData = {
      name: this.userForm.controls.name.value,
      email: this.userForm.controls.email.value,
      phone_number: num,
      user_id: this.user.uid,
      refreshtoken
    }
    this.authService.SignUp(userData, id).subscribe((res) => {
      // this.toggleLoginSignup();
      this.storeUserDetails(id, refreshtoken, res);
      this.toast.success("Signup Successful", "Successful", { timeOut: 3000 })

    }, (err) => {
      this.toast.error(err.message, "", { timeOut: 3000 })
    })
  }

  storeUserDetails(id, refreshToken, res) {
    let user = {
      name: res.name,
      number: res.number
    }
    window.localStorage.setItem("aToken", id);
    window.localStorage.setItem("rToken", refreshToken);
    window.localStorage.setItem("user", JSON.stringify(user));
    $("#signupModal").modal("hide");
    this.authService.notifyLoginStatus(true);
    this.router.navigate(['/menu']);
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


}
