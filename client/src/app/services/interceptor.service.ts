import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenExceptURL } from '../VO/constants';
import { catchError, filter, take, switchMap, finalize, map } from "rxjs/operators";
import { AuthService } from './auth.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);


  constructor(private authService: AuthService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const IsAdminURL = request.url.includes('admin');

    request = IsAdminURL ? this.AddAdminToken(request) : this.AddHeader(request);

    // if (request.url.includes('/refresh-token')) {
    //   return next.handle(request);
    // }

    // return new Observable((observer: Observer<any>) => {
    //   const sub = next.handle(request)
    //     .subscribe((event) => {
    //       // if (event instanceof HttpResponse) {
    //       //   observer.next(event);
    //       // }
    //       observer.next(event);
    //     }, (err) => {
    //       if (err instanceof HttpErrorResponse) {
    //         if (err.status == 401) {
    //           this.handle401(request, next)
    //             .subscribe((event) => {
    //               observer.next(event);
    //             }, (error) => {
    //               observer.error(error);
    //             })
    //         }
    //         else {
    //           return throwError(err);
    //         }
    //       }
    //     }, () => {
    //       observer.complete();
    //     })

    //   return (() => {
    //     sub.unsubscribe();
    //   })
    // })
    if (IsAdminURL) {
      return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
        if (error && error.status == 401) {
          this.router.navigate(['/admin/login']);
          return next.handle(this.AddAdminToken(request, true))
        }
        else
          return next.handle(this.AddAdminToken(request, true))
      }))
    }

    else {
      return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
        if (error && error.status == 401) {
          if (this.refreshTokenInProgress) {
            return this.refreshTokenSubject.pipe(
              filter(result => result !== null),
              take(1),
              switchMap(() => next.handle(this.AddHeader(request, true)))
            );
          }
          else {
            this.refreshTokenInProgress = true;
            this.refreshTokenSubject.next(null);

            return this.authService.RefreshToken().pipe(
              switchMap((success) => {
                this.refreshTokenSubject.next(success);
                return next.handle(this.AddHeader(request, true))
              }), finalize(() => {
                this.refreshTokenInProgress = false;
              }), catchError((err) => {
                throw err;
              }))
          }
        }
        else if (error && error.status == 403) {
          console.log(error);
          if (error.error.IsOpen)
            this.authService.notifyRestuClosed(error.error);
          return next.handle(this.AddHeader(request, true));
        }
        else {
          return throwError(error);
        }
      }))
    }

  }

  handle401(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (this.refreshTokenInProgress) {
      return this.refreshTokenSubject.pipe(
        filter(result => result !== null),
        take(1),
        switchMap(() => {
          return next.handle(this.AddHeader(request)).pipe(map((event) => {
            return event;
          }))
        })
      );
    }
    else {
      this.refreshTokenInProgress = true;
      this.refreshTokenSubject.next(null);

      return this.authService.RefreshToken().pipe(
        switchMap((success) => {
          this.refreshTokenSubject.next(success);
          return next.handle(this.AddHeader(request, true)).pipe(map((event) => {
            return event;
          }))
        }), finalize(() => {
          this.refreshTokenInProgress = false;
        }), catchError((err) => {
          throw err;
        }))
    }
  }

  private AddHeader(request: HttpRequest<any>, existingRequest: boolean = false) {
    let aToken = window.localStorage.getItem("aToken");
    let rToken = window.localStorage.getItem("rToken");
    return request.clone({
      url: existingRequest ? request.url : environment.serverBaseURL + request.url,
      setHeaders: TokenExceptURL.includes(request.url) ? {} : {
        accesstoken: aToken ? aToken : "",
        refreshtoken: rToken ? rToken : ""
      }
    })
  }

  private AddAdminToken(request: HttpRequest<any>, existingRequest: boolean = false) {
    const token = window.localStorage.getItem("token")
    return request.clone({
      setHeaders: TokenExceptURL.includes(request.url) ? {} : {
        token: token ? token : "",
      },
      url: existingRequest ? request.url : environment.serverBaseURL + request.url,
    })
  }
}
