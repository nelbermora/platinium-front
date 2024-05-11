import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Sport } from "../models/sport.model";

@Injectable()
export class WalletService{
    url: string = "";
    constructor(private http: HttpClient){
        if (environment.production){
            this.url = "galosportbets.com/pservices/be/wallet";
        }else{
            this.url = "http://localhost/pservices/be/wallet";
        }
    }

    getMovements(idUser: number){
         return this.http.get(this.url + "?idUser=" + idUser);
    }
}