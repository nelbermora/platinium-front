import { LoggerService } from './../../../services/logger.service';
import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login2',
  templateUrl: './login2.component.html',
  styleUrls: ['./login2.component.scss']
})
export class Login2Component implements OnInit {
  component = 'login';
  loading: boolean = false;
  constructor(private authSvc: AuthService, private router: Router,
              private logger: LoggerService) { }
  email: string;
  password: string;
  invalidLogin: boolean = false;
  ngOnInit() {
    this.logger.log(this.component, 'ingresa a la web');
  }

  doLogin(){
    this.loading = true;
    this.authSvc.login(this.email, this.password).subscribe(
      (resp : any)=> {
        this.loading = false;
        localStorage.setItem('token',resp.token);
        this.authSvc.logged = true;
        this.router.navigate(['/dashboard']);
      },
      error => {
        this.loading = false;
        this.invalidLogin = true;
      }
  );
  }

}
