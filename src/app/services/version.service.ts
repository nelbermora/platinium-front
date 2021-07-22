import { Config } from './../models/config.model';
import { environment } from './../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class VersionService{
    url: string = "";
    constructor(private http: HttpClient){
        if(environment.production){
            this.url = 'https://platiniumsport.com/pservices/be/version';
        }else{
            this.url = 'http://localhost/pservices/be/version';
        }
    }

    getVersion(){
        return this.http.get(this.url);
    }

    saveConfig(config: Config){
        return this.http.post<Config>(this.url, config);
    }
}