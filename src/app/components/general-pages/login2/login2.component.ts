import { User } from './../../../models/user.model';
import { AuthService } from './../../../services/auth.service';
import { LoggerService } from './../../../services/logger.service';
import { Router } from '@angular/router';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login2',
  templateUrl: './login2.component.html',
  styleUrls: ['./login2.component.scss']
})
export class Login2Component implements OnInit {
  @ViewChild("content") modalContent: TemplateRef<any>;
  component = 'login';
  paises = ['Antigua y Barbuda',
  'Argentina',
  'Bahamas',
  'Barbados',
  'Belice',
  'Bolivia',
  'Brasil',
  'Canadá',
  'Chile',
  'Colombia',
  'Costa Rica',
  'Cuba',
  'Dominica',
  'Dominicana',
  'Ecuador',
  'El Salvador',
  'Estados Unidos de América',
  'Granada',
  'Guatemala',
  'Guyana',
  'Haití',
  'Honduras',
  'Jamaica',
  'México',
  'Nicaragua',
  'Panamá',
  'Paraguay',
  'Perú',
  'Saint Kitts y Nevis',
  'San Vicente y las Granadinas',
  'Santa Lucía',
  'Suriname',
  'Trinidad y Tabago',
  'Uruguay',
  'Venezuela'];
  usuarioRegistro: User = {};
  loading: boolean = false; 
  agree: boolean = false; 
  confirmPass: string;
  passNotMatch: boolean = false;
  disAgree: boolean = false;
  notPass: boolean = false;
  notEmail: boolean = false;
  notCountry: boolean = false;
  invalidMail: boolean = false;
  invalidPass: boolean = false;
  constructor(private authSvc: AuthService, private router: Router,
              private logger: LoggerService,private modalService: NgbModal) { }
  email: string;
  password: string;
  invalidLogin: boolean = false;
  invalidRegistration: boolean = false;
  ngOnInit() {
    this.logger.log(this.component, 'ingresa a la web');
  }

  doLogin(){
    this.loading = true;
    this.authSvc.login(this.email, this.password).subscribe(
      (resp : any)=> {
        this.authSvc.idUser = resp.idUser;
        this.authSvc.activeUser = this.email;
        this.authSvc.isLogged.emit(true);
        this.loading = false;
        localStorage.setItem('token',resp.token);
        this.router.navigate(['/dashboard']);
      },
      error => {
        this.loading = false;
        this.invalidLogin = true;
      }
    );
  }

  open(){
    this.modalService.open(this.modalContent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {}, (reason) => {});
  }
  
  register(){
    if(this.validRegistration()){
      this.loading = true;
      this.authSvc.register(this.usuarioRegistro).subscribe(
        (resp : any)=> {
          this.authSvc.idUser = resp.idUser;
          this.authSvc.activeUser = this.email;
          this.authSvc.isLogged.emit(true);
          this.loading = false;
          localStorage.setItem('token',resp.token);
          this.modalService.dismissAll();
          this.router.navigate(['/dashboard']);
        },
        error => {
          this.loading = false;
          this.invalidRegistration = true;
        }
      ); 
    }    
  }

  validRegistration(){
    let valid = false;
    if(this.validMail() && this.usuarioRegistro.password === this.confirmPass 
        && this.confirmPass !== null && this.confirmPass !== undefined
        && this.usuarioRegistro.correo !== null && this.usuarioRegistro.correo !== undefined
        && this.usuarioRegistro.paisResidencia !== null && this.usuarioRegistro.paisResidencia !== undefined
        && this.usuarioRegistro.password.length >= 6
    ){
      if(this.agree){
        valid = true;
        this.disAgree = false;
      }else{
        this.disAgree = true;        
      }
    }

    if(this.usuarioRegistro.password === this.confirmPass){
      this.passNotMatch = false;
    }else{
      this.passNotMatch = true;
    }

    if(this.usuarioRegistro.correo === null || this.usuarioRegistro.correo === undefined){
      this.notEmail = true;
    }else{
      this.notEmail = false;
    }

    if(this.usuarioRegistro.paisResidencia === null || this.usuarioRegistro.paisResidencia === undefined){
      this.notCountry = true;
    }else{
      this.notCountry = false;
    }

    if(this.usuarioRegistro.password === null || this.usuarioRegistro.password === undefined){
      this.notPass = true;
    }else{
      if(this.usuarioRegistro.password.length < 6){
        this.invalidPass = true;
      }else{
        this.invalidPass = false;
      }
      this.notPass = false;
            
    }

    return valid;    
  }

  validMail(){
    let valid = false;
    if(this.usuarioRegistro.correo.includes('@') 
    && this.usuarioRegistro.correo.includes('.')
    && this.usuarioRegistro.correo.length > 7){
      this.invalidMail = false;
      valid = true;
    }else{    
      this.invalidMail = true;
    }    
    return valid;
  }


}
