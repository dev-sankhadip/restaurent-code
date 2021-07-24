import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { CartComponent } from '../cart/cart.component';


declare var $: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  public isShown: boolean = false;
  public isLogin: boolean = false;
  public isSignup: boolean = false;
  public IsLoggedIn: boolean = null;
  private sub_UserLoggedInOrOut: Subscription;
  private sub_IsAdmin: Subscription;
  public IsAdmin: boolean = false;
  public IsAdminLoggedIn: boolean = false;

  @ViewChild(CartComponent, { static: false }) public cartComponent: CartComponent;

  constructor(private authService: AuthService, private menuService: MenuService, private router: Router) { }

  ngOnInit(): void {
    this.sub_UserLoggedInOrOut = this.authService.obsr_UserLoggedInOrOut.subscribe((res: boolean) => {
      this.IsLoggedIn = res;
    })

    this.sub_IsAdmin = this.authService.obsr_IsAdmin.subscribe((res) => {
      this.IsAdmin = res[0];
      this.IsAdminLoggedIn = res[1]
    })
  }

  ngOnDestroy() {
    this.sub_UserLoggedInOrOut.unsubscribe();
    this.sub_IsAdmin.unsubscribe();
  }

  toggleShow() {
    if (this.IsLoggedIn) {
      $(".mdi-shopping").addClass("text-light");
      this.menuService.notifyCartShow();
    }
    else
      this.toggleLogin();
  }

  toggleLogin() {
    this.authService.notifyResetSignupComponent();
    $('#signupModal').modal('show');
  }
  collapse() {
    $('.navbar-collapse').collapse('hide');
    $('#signupModal').modal('hide');
    $("#cartModal").modal('hide');
  }

  logout() {
    window.localStorage.removeItem("aToken");
    window.localStorage.removeItem("rToken");
    window.localStorage.removeItem("user");

    let currentUrl = this.router.url;
    if (currentUrl == '/') {
      this.IsLoggedIn = null;
    }
    else
      this.router.navigate(['/']);
  }

  scrollBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  AdminLogout() {
    window.localStorage.removeItem("token");
    this.router.navigate(['/admin/login']);
  }

}
