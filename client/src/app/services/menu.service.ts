import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  private CartShow = new Subject<any>();
  public obsr_CartShow = this.CartShow.asObservable();

  public notifyCartShow() {
    this.CartShow.next();
  }


  getProducts(): Observable<any> {
    return this.http.get('/menu/items');
  }

  AddToCart(menu_id: string, cat_id: string, qty: number): Observable<any> {
    return this.http.post('/menu/add-to-cart', { menu_id, cat_id, qty });
  }

  GetCartItems(): Observable<any> {
    return this.http.get('/menu/cartitems');
  }

  UpdateCartItems(cart_data): Observable<any> {
    return this.http.put('/menu/update-cart', { ...cart_data })
  }

  RemoveCartItem(menu_id: string): Observable<any> {
    let params = new HttpParams();
    params = params.append("menu_id", menu_id);
    return this.http.delete('/menu/remove-item', { params });
  }

  CheckOutCart(token: string, orderDetails, state: string = "Western Australia"): Observable<any> {
    return this.http.post('/menu/check-out', { token, ...orderDetails, state });
  }

  GetLookupValues(lookup_cat: Array<string> = null): Observable<any> {
    return this.http.post('/lookup', { lookup_cat });
  }

  getDeliveryChargeList(): Observable<any> {
    return this.http.get('/lookup/config');
  }

  GetUserOrder(): Observable<any> {
    return this.http.get('/menu/order');
  }

  GetOrderStatus(orderId: string) {
    return this.http.get('/menu/orderstatus', { params: new HttpParams().append('order_id', orderId) });
  }

  CreatePaymentIntent(name: string, email: string, orderDetails, state: string = "Western Australia") {
    return this.http.post('/menu/check-out', { name, email, ...orderDetails, state })
  }

  GetPaymentStatus = (pi: string, orderId: string) => {
    return this.http.post('/menu/payment-status', { pi, orderId });
  }

  GetAddressListOfUser() {
    return this.http.get('/menu/address-list');
  }
}