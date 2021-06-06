import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login2',
  templateUrl: './login2.component.html',
  styleUrls: ['./login2.component.scss']
})
export class Login2Component implements OnInit {

  constructor(private authSvc: AuthService, private router: Router) { }
  email: string;
  password: string;
  invalidLogin: boolean = false;
  ngOnInit() {
  }

  doLogin(){
    this.authSvc.login(this.email, this.password).subscribe(
      (resp : any)=> {
        console.log(resp);
        localStorage.setItem('token',resp.token);
        this.authSvc.logged = true;
        this.router.navigate(['/dashboard']);
      },
      error => {
        this.invalidLogin = true;
      }
  );
  }

}
