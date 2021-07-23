import { AuthService } from './../services/auth.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
export class AdminGuardian implements CanActivate{
    constructor(private router: Router, private authService: AuthService){}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        if(this.authService.activeUser.type === 'Admin'){
            return new Observable((observer) => {
                observer.next(true);
                observer.complete();
            });
        }else{
            return new Observable((observer) => {
                observer.next(false);
                observer.complete();
            });
        }        
    }
}