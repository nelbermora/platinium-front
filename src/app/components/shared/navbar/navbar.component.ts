import { User } from './../../../models/user.model';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavbarComponent implements OnInit {
  user: User;
  public iconOnlyToggled = false;
  public sidebarToggled = false;  
  saldo: number = 0;
  isLoggedIn$: Observable<boolean>;
  toggleSidebar() {
    let body = document.querySelector('body');
    if((!body.classList.contains('sidebar-toggle-display')) && (!body.classList.contains('sidebar-absolute'))) {
      this.iconOnlyToggled = !this.iconOnlyToggled;
      if(this.iconOnlyToggled) {
        body.classList.add('sidebar-icon-only');
      } else {
        body.classList.remove('sidebar-icon-only');
      }
    } else {
      this.sidebarToggled = !this.sidebarToggled;
      if(this.sidebarToggled) {
        body.classList.add('sidebar-hidden');
      } else {
        body.classList.remove('sidebar-hidden');
      }
    }
  }

  constructor(config: NgbDropdownConfig, public authSvc: AuthService) {
    config.placement = 'bottom-right';  
  }

  ngOnInit() {
    this.user = this.authSvc.activeUser;
    this.authSvc.isLogged.subscribe(
      resp => {
        this.user = this.authSvc.activeUser;
        this.authSvc.getHome().subscribe((resp: any) => {
          this.saldo = resp.saldo;      
        });
      }
    );
    this.authSvc.getHome().subscribe((resp: any) => {
      this.saldo = resp.saldo;      
    })
    this.isLoggedIn$ = this.authSvc.isLoggedIn;
    this.authSvc.fundsChange.subscribe(
      resp => {
        this.authSvc.getHome().subscribe((resp: any) => {
          this.saldo = resp.saldo;      
        });  
      }
    )
  }

  closeSettingsSidebar() {
    document.querySelector('#right-sidebar').classList.toggle('open');
  }

  focusInput() {
    const navbarSearchInput = <HTMLElement>document.querySelector('#navbar-search-input');
    navbarSearchInput.focus();
  }

  toggleRightSidebar() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }

  logout(){
    this.authSvc.logout();
  }


}
