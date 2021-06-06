import { environment } from './../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Sport } from '../models/sport.model';

@Injectable()
export class OddService{
    url: string = "";
    constructor(private http: HttpClient){
        if (environment.production){
            this.url = "https://platiniumsport.com/pservices/be/odds";
        }else{
            this.url = "http://localhost/pservices/be/odds";
        }
    }

    getOdds(sportName: string){
     
        return this.http.get<Sport>(this.url + "?sport=" + sportName);
    }
}