import { AuthService } from './../services/auth.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
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
                if (response.idUser > 0) {
                    this.authService.idUser = response.idUser;
                    this.authService.activeUser = response.email;
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