import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements Resolve<any> {

  constructor(private authService: AuthService, private router: Router) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let aToken = window.localStorage.getItem("aToken");
      let rToken = window.localStorage.getItem("rToken");
      if (aToken == null || rToken == null) {
        this.authService.notifyLoginStatus(false);
        resolve(false);
        return;
      }
      this.authService.CheckUserLogin()
        .subscribe(() => {
          this.authService.notifyLoginStatus(true);
          resolve(true);
        }, (err: HttpErrorResponse) => {
          console.log(err);
          if (err.status == 401) {
            this.authService.notifyLoginStatus(false);
            resolve(false);
          }
          if (err.status == 400 && err.error.ForceLogin == true) {
            resolve(false);
          }
        })
    })
  }
}
