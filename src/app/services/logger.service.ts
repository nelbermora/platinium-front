import { AuthService } from './auth.service';
import { IpService } from './ip.service';
import { environment } from './../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable()
export class LoggerService{
    url: string = "";
    myDevice: string;
    myIp: string;
    constructor(private http: HttpClient, private deviceService: DeviceDetectorService,
                private ipSvc: IpService, private authGdn: AuthService){
        if (environment.production){
            this.url = "galosportbets.com/pservices/be/logger";
        }else{
            this.url = "http://localhost/pservices/be/logger";
        }
        this.myDevice = deviceService.os + ": " + deviceService.os_version + " - isDesktop: " + deviceService.isDesktop();        
    }

    log(component: string, desc: string, reference?: string){
        this.ipSvc.getIPAddress().subscribe(
            (resp: any) =>{
                this.http.post(this.url, {
                    ip: resp.ip,
                    device: this.myDevice,
                    usuario: this.authGdn.activeUser.correo,
                    componente: component,
                    referencia: reference,
                    descripcion: desc
                }).subscribe();                
            }
        );        
    }
}