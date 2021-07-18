import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { catchError, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  private initialValue = {
    IsOpen:
      [false, "00:00", "00:00"]
  }

  public restuClose = new BehaviorSubject(this.initialValue);

  private UserLoggedInOrOut = new Subject<boolean>();
  public obsr_UserLoggedInOrOut = this.UserLoggedInOrOut.asObservable();

  private ResetSignupComponent = new Subject<any>();
  public obsr_ResetSignupComponent = this.ResetSignupComponent.asObservable();

  private IsAdmin = new Subject<[boolean, boolean]>();
  public obsr_IsAdmin = this.IsAdmin.asObservable();

  public notifyLoginStatus(status: boolean) {
    this.UserLoggedInOrOut.next(status);
  }

  public notifyResetSignupComponent() {
    this.ResetSignupComponent.next();
  }

  public notifyRestuClosed(IsClosed) {
    this.restuClose.next(IsClosed);
  }

  public notifyIsAdmin(IsAdmin: boolean, IsAdminLoggedIn: boolean) {
    this.IsAdmin.next([IsAdmin, IsAdminLoggedIn]);
  }

  get windowRef() {
    return window
  }

  SignUp(userData, aToken): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append("accesstoken", aToken);
    return this.http.post('/auth/signup', { ...userData }, { headers: headers })
  }

  Login(userData): Observable<any> {
    return this.http.post('/auth/login', { ...userData })
  }

  CheckUserLogin(): Observable<any> {
    return this.http.get('/auth/check-login')
  }

  CheckUserExist(phone_number: string): Observable<any> {
    return this.http.post('/auth/check-user', { phone_number });
  }

  RefreshToken() {
    return this.http.post<any>('/auth/refresh-token', { refreshtoken: window.localStorage.getItem("rToken") })
      .pipe(catchError(err => {
        throw err;
      }), tap((token) => {
        window.localStorage.setItem("aToken", token.token)
      }))
  }

  CheckRestaurantTime() {
    return this.http.get('/lookup/time');
  }


}
