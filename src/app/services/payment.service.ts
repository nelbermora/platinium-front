import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable()
export class PaymentService{
    url: string = "";
    constructor(private http: HttpClient){
        if(environment.production){
            this.url = 'https://platiniumsport.com/pservices/be/pagos';
        }else{
            this.url = 'http://localhost/pservices/be/pagos';
        }
    }    

    savePayment(form: FormData){
        return  this.http.post<any>(this.url, form);
    }

    get(userId: number){
        return  this.http.get(this.url + '?userId=' + userId);
    }
}