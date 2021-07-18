import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements Resolve<any> {

  constructor(private authService: AuthService, private router: Router, private adminService: AdminService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (state.url.indexOf("admin") != -1) {
        const token = window.localStorage.getItem("token")
        if (token == null || token == "") {
          this.authService.notifyIsAdmin(true, false);
          if (state.url !== '/admin/login') {
            this.router.navigate(['/admin/login']);
          }
        }
        else {
          this.adminService.AdminLogin(token)
            .subscribe((res) => {
              this.authService.notifyIsAdmin(true, true);
              if (state.url == '/admin/login') {
                this.router.navigate(['/admin/currentorder']);
              }
            }, (err) => {
              this.authService.notifyIsAdmin(true, false);
            })
        }
        resolve(true)
      }
      else {
        this.authService.notifyIsAdmin(false, false);
        resolve(false)
      }
    })
  }
}
