import { User } from './../../../models/user.model';
import { AuthService } from './../../../services/auth.service';
import { LoggerService } from './../../../services/logger.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login2',
  templateUrl: './login2.component.html',
  styleUrls: ['./login2.component.scss']
})
export class Login2Component implements OnInit, AfterViewInit {
  @ViewChild("content") modalContent: TemplateRef<any>;
  @ViewChild("forgot") modalForgot: TemplateRef<any>;
  component = 'login';
  watchPass: boolean = false;
  paises = ['España',
  'Reino Unido',
  'Francia',  
  'Canadá',  
  'Estados Unidos de América'
  ];
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
  codeSent: boolean = false;
  emailReset: string;
  tokenReset: number;
  passReset: string;
  confirmPassReset: string;
  emailResetInvalid: boolean;
  invalidNewPass: boolean;
  passNotMatchReset: boolean;
  invalidResetToken: boolean;
  constructor(private authSvc: AuthService, private router: Router,
              private logger: LoggerService,private modalService: NgbModal,
              private route: ActivatedRoute) { }
  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      if((params.l === 1) || (params.l === "1")){
        this.logger.log(this.component, 'logger initializer');
      }
    });
    this.logger.log(this.component, 'ingresa a la web');
  }
  email: string;
  password: string;
  invalidLogin: boolean = false;
  invalidRegistration: boolean = false;
  ngOnInit() {}

  doLogin(){
    this.loading = true;
    this.authSvc.login(this.email, this.password).subscribe(
      (resp : any)=> {
        this.authSvc.activeUser = resp;
        //this.authSvc.activeUser.correo = this.email;
        //this.authSvc.activeUser.primerNombre = resp.id;
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

  openForgot(){    
    this.modalService.open(this.modalForgot, {ariaLabelledBy: 'modal-basic-title-2'}).result.then((result) => {}, (reason) => {});
  }
  
  register(){
    if(this.validRegistration()){
      this.loading = true;      
      this.authSvc.register(this.usuarioRegistro).subscribe(
        (resp : any)=> {
          if(resp.id !== undefined && resp.id !== null && resp.id > 0){
            this.authSvc.activeUser = resp;
            //this.authSvc.activeUser.id = resp;
            //this.authSvc.activeUser.correo = this.email;
            this.authSvc.isLogged.emit(true);
            this.loading = false;
            localStorage.setItem('token',resp.token);
            this.modalService.dismissAll();
            this.router.navigate(['/dashboard']);
          }else{
            this.loading = false;
            this.invalidRegistration = true;
          }          
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

  resetPass(){
    this.loading = true;
    if(!this.codeSent){
      this.authSvc.getResetToken(this.emailReset).subscribe(
        (resp : any) =>{
          if(resp.code == 0){
            this.codeSent = true;
            this.emailResetInvalid = false;
          }else{
            this.codeSent = false;
            this.emailResetInvalid = true;
          }
          this.loading = false;
        }
      )
    }else{
      if(this.validReset()){
        this.authSvc.changePass(this.emailReset, this.passReset, this.tokenReset).subscribe(
          (resp: any) =>{
            if(resp.code == 0){
              this.loading = false;
              this.modalService.dismissAll();
              Swal.fire(
                'Password cambiado exitosamente!',
                '',
                'success'
              );          
            }else{
              this.loading = false;
              this.invalidResetToken = true;
            }
          }
        )
      }else{
        this.loading = false;
      }
    }
  }

  validReset(){
    let valid = true;
    if(this.passReset === undefined || this.passReset === null || this.passReset.length < 6){
      this.invalidNewPass = true;
      valid = false;
    }else{
      this.invalidNewPass = false;      
    }

    if(this.passReset != this.confirmPassReset){
      this.passNotMatchReset = true;
      valid = false;
    }else{
      this.passNotMatchReset = false;      
    }
    return valid;
  }

  verPass(){
    this.watchPass = !this.watchPass;
  }

}
