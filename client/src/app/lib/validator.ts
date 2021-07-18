import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export const EmailValidator: ValidatorFn = (control: AbstractControl): ValidationErrors => {
    let email = control.value.trim();
    if (email == "")
        return null;

    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const result = re.test(String(email).toLowerCase()) ? null : { email: true };

    return result;
};


export const NumberValidator: ValidatorFn = (control: AbstractControl): ValidationErrors => {
    const number = control.value;
    if (number == "")
        return null;
    let IsNumber = new RegExp('^[0-9]\d{0,9}(\.\d{1,3})?%?$').test(number)
    return IsNumber ? null : { Number: true };
}