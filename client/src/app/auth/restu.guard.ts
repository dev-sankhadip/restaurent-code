import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RestuGuard implements Resolve<any> {

  constructor(private authService: AuthService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.authService.CheckRestaurantTime()
        .subscribe((res) => {
          this.authService.notifyRestuClosed(res);
          resolve(false);
        }, (err: HttpErrorResponse) => {
          if (err.status == 403) {
            this.authService.notifyRestuClosed(err.error);
            resolve(true);
          }
        })
    })
  }
}
