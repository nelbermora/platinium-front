import { UserService } from './user.service';
import { Router } from '@angular/router';
import { Injectable } from "@angular/core";

@Injectable()
export class AuthService{
    logged: boolean = false;
    constructor(private router: Router, private userSvc: UserService){

    }
    
    islogged(){
        return this.logged;
    }

    logout(){
        this.logged = false;
        this.router.navigate(['/login']);
    }
    
    login(user: string, pass: string){
        return this.userSvc.authenticate(user, pass);
    }


}