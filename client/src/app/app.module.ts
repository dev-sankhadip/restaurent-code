import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from "ngx-ui-loader";


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/user/menu/menu.component';
import { NavbarComponent } from './components/user/navbar/navbar.component';
import { FooterComponent } from './components/static_page/footer/footer.component';
import { FindUsComponent } from './components/static_page/find-us/find-us.component';
import { InterceptorService } from './services/interceptor.service';
import { OurStoryComponent } from './components/static_page/our-story/our-story.component';
import { HomeComponent } from './components/static_page/home/home.component';
import { ErrorComponent } from './shared/error/error.component';
import { SignupComponent } from './components/user/signup/signup.component';
import { CurrentOrderComponent } from './components/admin/current-order/current-order.component';
import { OrderDetailsComponent } from './components/admin/order-details/order-details.component';
import { CartComponent } from './components/user/cart/cart.component';
import { CheckoutComponent } from './components/user/checkout/checkout.component';
import { PaymentChargeComponent } from './components/user/payment-charge/payment-charge.component';
import { SettingComponent } from './components/admin/setting/setting.component';
import { TimingsComponent } from './components/admin/timings/timings.component';
import { EditMenuComponent } from './components/admin/edit-menu/edit-menu.component';
import { OrdersComponent } from './components/user/orders/orders.component';
import { DeliveryStatusComponent } from './components/user/delivery-status/delivery-status.component';
import { UserGuard } from './auth/user.guard';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { BankDetailsComponent } from './components/user/bank-details/bank-details.component';
import { PrivacyPolicyComponent } from './components/static_page/privacy-policy/privacy-policy.component';
import { BillingComponent } from './components/admin/billing/billing.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    NavbarComponent,
    FooterComponent,
    FindUsComponent,
    OurStoryComponent,
    HomeComponent,
    ErrorComponent,
    SignupComponent,
    CurrentOrderComponent,
    OrderDetailsComponent,
    CartComponent,
    CheckoutComponent,
    PaymentChargeComponent,
    SettingComponent,
    TimingsComponent,
    EditMenuComponent,
    OrdersComponent,
    DeliveryStatusComponent,
    AdminLoginComponent,
    BankDetailsComponent,
    PrivacyPolicyComponent,
    BillingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 300, closeButton: true
    }),
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true, exclude: ["/menu/payment-status"] })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    UserGuard
    // {
    //   provide: LocationStrategy,
    //   useClass: HashLocationStrategy
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
