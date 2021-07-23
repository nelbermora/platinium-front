import { AuthService } from './../services/auth.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
export class AuthGuardian implements CanActivate{
    isLogged = false;
    constructor(private router: Router, private authService: AuthService){}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        if(!this.isLogged){
            return this.authService.isAuthenticated().pipe(map((response: any) => {
                if (response.id !== null && response.id !==undefined && response.id > 0) {
                    this.authService.activeUser = response;
                    this.authService.isLogged.emit(true);
                    this.isLogged = true;
                    return true;
                }
                this.router.navigate(['/login']);
                return false;            
            }), catchError((error) => {
                this.router.navigate(['/login']);
                return of(false);
            }));
        }else{
            return new Observable((observer) => {
                observer.next(true);
                observer.complete();
            })
        }        
    }
}