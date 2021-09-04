import { User } from "./../models/user.model";
import { UserService } from "./user.service";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class AuthService {
  activeUser: User = {};
  private loggedIn = new BehaviorSubject<boolean>(false);
  url: string = "";
  isLogged = new EventEmitter<boolean>();
  fundsChange = new EventEmitter<boolean>();
  constructor(private router: Router, private http: HttpClient) {
    if (environment.production) {
      this.url = "https://platiniumsport.com/pservices/be";
    } else {
      this.url = "http://localhost/pservices/be";
    }
    this.isLogged.subscribe((resp: boolean) => {
      this.loggedIn.next(resp);
    });
  }

  isAuthenticated() {
    return this.http.post(this.url + "/authenticate", {
      token: localStorage.getItem("token"),
    });
  }

  logout() {
    this.isLogged.emit(false);
    localStorage.removeItem("token");
    this.router.navigate(["/login"]);
  }

  login(user: string, pass: string) {
    return this.http.post(this.url + "/login", {
      correo: user,
      password: pass,
    });
  }

  register(user: User) {
    return this.http.post<User>(this.url + "/register", user);
  }

  update(user: User) {
    return this.http.post<User>(this.url + "/user", user);
  }

  updatePass(user: User) {
    return this.http.put<User>(this.url + "/user", user);
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  getHome(){
    return this.http.get(this.url + "/inicio?idUser=" + this.activeUser.id);
  }

  getResetToken(email: string){
    return this.http.get(this.url + "/register?email=" + email);
  }

  changePass(email: string, password: string, token: number ){
    return this.http.put(this.url + "/register", {
      email: email,
      pass: password,
      token_reset: token
    });
  }

  getAll(){
    return this.http.get(this.url + "/user");
  }
}
