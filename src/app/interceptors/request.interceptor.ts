import { NgxSpinnerService } from 'ngx-spinner';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, retryWhen } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
excluded = 'https://api.ipify.org?format=json';
  constructor(
    private router: Router,
    private spinnerSvc: NgxSpinnerService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
    const token: string = localStorage.getItem('token');
    //const token: string ='asdasdasd';

    let request = req;
    if (token && req.url != this.excluded) {
      request = req.clone({
        setHeaders: {
          authorization: `Bearer ${ token }`
        }
      });
    }

    return next.handle(request).pipe(
      retry(3),
      catchError((err: HttpErrorResponse) => {

        if (err.status === 401) {
          this.router.navigate(['/login']);
          this.spinnerSvc.hide();
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error en el servicio!',
            footer: 'Comprueba tu conexion de internet o intenta de nuevo en unos minutos'
          })
        }
        return throwError( err );

      })
    );
  }

}