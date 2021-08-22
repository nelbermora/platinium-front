import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public uiBasicCollapsed = false;
  public uiAdvancedCollapsed = false;
  public formsCollapsed = false;
  public editorsCollapsed = false;
  public chartsCollapsed = false;
  public tablesCollapsed = false;
  public iconsCollapsed = false;
  public mapsCollapsed = false;
  public userPagesCollapsed = false;
  public errorCollapsed = false;
  public generalPagesCollapsed = false;
  public eCommerceCollapsed = false;
  isAdmin: boolean = false;
  isLoggedIn$: Observable<boolean>;
  constructor(private authSvc: AuthService) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authSvc.isLoggedIn;
    if(this.authSvc.activeUser.type === 'Admin'){
      this.isAdmin = true;
    }else{
      this.isAdmin = false;
    }
    this.authSvc.isLogged.subscribe(
      resp => {
        if(this.authSvc.activeUser.type === 'Admin'){
          this.isAdmin = true;
        }else{
          this.isAdmin = false;
        }
      }
    )
    const body = document.querySelector('body');

    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    document.querySelectorAll('.sidebar .nav-item').forEach(function (el) {
      el.addEventListener('mouseover', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function() {
        if(body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });

  }

  toggleRightSidebar() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }

}
