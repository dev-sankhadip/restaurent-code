import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../lib/validator';


@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  get SignUpForm(): FormGroup {
    return new FormGroup({
      name: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, EmailValidator]),
      phoneNo: new FormControl("", [Validators.required]),
    })
  }

  get LoginForm(): FormGroup {
    return new FormGroup({
      phoneNo: new FormControl("", [Validators.required]),
    })
  }

  get CartForm(): FormGroup {
    return new FormGroup({
      cat_id: new FormControl(""),
      menu_id: new FormControl(""),
      name: new FormControl(""),
      qty: new FormControl("", [Validators.required]),
      price: new FormControl(""),
      type: new FormControl("")
    })
  }

  get CheckOutForm(): FormGroup {
    return new FormGroup({
      orderType: new FormControl("P", [Validators.required]),
      username: new FormControl("", [Validators.required]),
      addrId: new FormControl(null),
      deliveryArea: new FormControl("SH"),
      fullAddr: new FormControl(null),
      zipCode: new FormControl(null),
      landmark: new FormControl(null),
      paymentMethod: new FormControl("C", [Validators.required])
    })
  }

  get MenuForm(): FormGroup {
    return new FormGroup({
      name: new FormControl("", [Validators.required]),
      desc: new FormControl("", [Validators.required]),
      price: new FormControl("", [Validators.required]),
    })
  }

  get TimingForm(): FormGroup {
    return new FormGroup({
      openTime: new FormControl("", [Validators.required]),
      openTimeType: new FormControl("am", [Validators.required]),
      endTime: new FormControl("", [Validators.required]),
      endTimeType: new FormControl("pm", [Validators.required]),
      day: new FormControl("0", [Validators.required]),
      month: new FormControl("1", [Validators.required])
    })
  }

  get AdminLoginForm(): FormGroup {
    return new FormGroup({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required])
    })
  }
}
