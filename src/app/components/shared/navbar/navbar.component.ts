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
  user: string;
  public iconOnlyToggled = false;
  public sidebarToggled = false;  
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
      }
    );
    this.isLoggedIn$ = this.authSvc.isLoggedIn;
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
