import { Payment } from './../models/payment.model';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable()
export class PaymentService{
    url: string = "";
    constructor(private http: HttpClient){
        if(environment.production){
            this.url = 'https://galosportbets.com/pservices/be/pagos';
        }else{
            this.url = 'http://localhost/pservices/be/pagos';
        }
    }    

    savePayment(form: FormData){
        return  this.http.post<any>(this.url, form);
    }

    uploadWithdrawal(form: FormData, id: number){
        return  this.http.post<any>(this.url + '?id=' + id, form);
    }

    get(userId: number){
        return  this.http.get(this.url + '?userId=' + userId);
    }

    getWithdrawals(userId: number){
        return  this.http.get(this.url + '?userId=' + userId + "&w=1");
    }

    updatePayment(payment: Payment){
        return  this.http.put<Payment>(this.url, payment);
    }

    saveWithdrawal(payment: Payment){
        return  this.http.post<any>(this.url + "?w=1", payment);
    }

    delete(payment: Payment, reverse: boolean){
        let param: string;
        reverse ? param = "&reverse=1" : param = "";
        return  this.http.delete<any>(this.url + "?w=" + payment.id + param);
    }
}