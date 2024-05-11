import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable()
export class ReportService{
    url: string = "";
    constructor(private http: HttpClient){
        if (environment.production){
            this.url = "galosportbets.com/pservices/be/reports";
        }else{
            this.url = "http://localhost/pservices/be/reports";
        }
    }

    getReport(type: string, desde: string, hasta: string, currency: string){
        let curParam: string = "";
        if(currency !== ""){
            curParam = "&moneda=" + currency;
        }
        let parameters = "?desde=" + desde + "&hasta=" + hasta + "&type=" + type + curParam;
        if(type === undefined || type === null){
            parameters = "?desde=" + desde + "&hasta=" + hasta  + curParam;
        }
        return this.http.get(this.url + parameters);
    }

}
