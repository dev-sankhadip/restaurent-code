import { BillingComponent } from './components/admin/billing/billing.component';
import { PrivacyPolicyComponent } from './components/static_page/privacy-policy/privacy-policy.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { DeliveryStatusComponent } from './components/user/delivery-status/delivery-status.component';
import { OrdersComponent } from './components/user/orders/orders.component';
import { SettingComponent } from './components/admin/setting/setting.component';
import { CheckoutComponent } from './components/user/checkout/checkout.component';
import { HomeComponent } from './components/static_page/home/home.component';
import { OurStoryComponent } from './components/static_page/our-story/our-story.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { MenuComponent } from "./components/user/menu/menu.component";
import { CurrentOrderComponent } from './components/admin/current-order/current-order.component';
import { UserGuard } from './auth/user.guard';
import { RestuGuard } from './auth/restu.guard';
import { AdminGuard } from './auth/admin.guard';


const routes: Routes = [
  { path: "", component: HomeComponent, resolve: { IsLoggedIn: UserGuard, IsClosed: RestuGuard } },
  { path: "menu", component: MenuComponent, resolve: { IsLoggedIn: UserGuard, IsClosed: RestuGuard } },
  { path: "checkout", component: CheckoutComponent, resolve: { IsLoggedIn: UserGuard, IsClosed: RestuGuard } },
  { path: "ourstory", component: OurStoryComponent, resolve: { IsLoggedIn: UserGuard, IsClosed: RestuGuard } },
  { path: "orders", component: OrdersComponent, resolve: { IsLoggedIn: UserGuard, IsClosed: RestuGuard } },
  { path: "order-status/:orderId", component: DeliveryStatusComponent, resolve: { IsLoggedIn: UserGuard, IsClosed: RestuGuard } },
  { path: "privacy", component: PrivacyPolicyComponent, resolve: { IsLoggedIn: UserGuard, IsClosed: RestuGuard } },
  {
    path: "admin", children: [
      { path: "currentorder", component: CurrentOrderComponent, resolve: { IsAdmin: AdminGuard } },
      { path: "pastorder", component: OrdersComponent, resolve: { IsAdmin: AdminGuard } },
      { path: "setting", component: SettingComponent, resolve: { IsAdmin: AdminGuard } },
      { path: "login", component: AdminLoginComponent, resolve: { IsAdmin: AdminGuard } },
      { path: "billing", component: BillingComponent, resolve: { IsAdmin: AdminGuard } }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
