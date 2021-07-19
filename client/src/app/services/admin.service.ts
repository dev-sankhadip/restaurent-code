import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  private RefreshCurrentOrder = new Subject<string>();
  public obsr_RefreshCurrentOrder = this.RefreshCurrentOrder.asObservable();

  public notifyRefreshCurrentOrder(orderId: string) {
    this.RefreshCurrentOrder.next(orderId);
  }

  GetOrderDetails() {
    return this.http.get("/admin/order");
  }

  UpdateOrderStatus(orderId, orderStatus, unacptReason: string = null) {
    return this.http.put('/admin/update-order', { orderId, orderStatus, unacptReason });
  }

  GetCategory() {
    return this.http.get('/admin/category');
  }

  GetMenu(cat_id: string) {
    let params = new HttpParams();
    params = params.append("cat_id", cat_id);
    return this.http.get('/admin/menu', { params });
  }

  DeleteMenuItem(menu_id: string, cat_id: string) {
    let params = new HttpParams();
    params = params.append("cat_id", cat_id);
    params = params.append("menu_id", menu_id);
    return this.http.delete('/admin/menu', { params });
  }

  AddMenu({ name, desc, price, cat_id }) {
    price = Number(price).toFixed(2)
    return this.http.post('/admin/add-menu', { name, desc, price, cat_id });
  }

  SetRestaurentTime(value) {
    return this.http.put('/admin/update-time', { ...value })
  }

  GetAllPastOrders() {
    return this.http.get('/admin/past-order');
  }

  AdminLogin(userDetails: string) {
    return this.http.post('/admin/login', { token: userDetails })
  }

  RefundDeliveredOrder(order_id: string, payMethod: string) {
    return this.http.post('/admin/refund-order', { order_id, payMethod });
  }

  GetTodaySchedule() {
    return this.http.get('/admin/schedule');
  }

  GetBillingDetails() {
    return this.http.get('/admin/billing');
  }
}
