import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from "@angular/core";

@Injectable()
export class UserService{
    url: string = "";
    constructor(private http: HttpClient){
        if(environment.production){
            this.url = "galosportbets.com/pservices/be";
        }else{
            this.url = "http://localhost/pservices/be"
        }
    }

    authenticate(user: string, pass: string){
        return this.http.post(this.url + "/login", {
                   correo: user,
                   password: pass
               });
    }

    isValidToken(token: string){
        return this.http.post(this.url + "/authenticate", {
            token: token            
        });
    }
}