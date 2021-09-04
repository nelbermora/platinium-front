import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'justdo-angular';
  showSidebar: boolean = true;
  showNavbar: boolean = true;
  showFooter: boolean = true;
  showSettings: boolean = true;

  constructor(private router: Router) {
    
    // Removing Sidebar, Navbar, Footer for Documentation and Auth pages
    router.events.forEach((event) => {   
      if(event instanceof NavigationStart) {
        if((event['url'] == '/documentation') || (event['url'] == '/login') || (event['url'] == '/login-2') || (event['url'] == '/register') || (event['url'] == '/register-2') || (event['url'] == '/lock-screen') || (event['url'] == '/error-404') || (event['url'] == '/error-500')
            || (event['url'] == '/login?l=1') ) {
          this.showSidebar = false;
          this.showNavbar = false;
          this.showFooter = false;
          this.showSettings = false;
          document.querySelector('.main-panel').classList.add('w-100');
          document.querySelector('.page-body-wrapper').classList.add('full-page-wrapper');
          if((event['url'] == '/login-2') || (event['url'] == "/register-2")) {
            document.querySelector('.content-wrapper').classList.add('auth', 'auth-img-bg', );
          } else if(event['url'] == '/lock-screen') {
            document.querySelector('.content-wrapper').classList.add('auth', 'lock-full-bg');
          } else {
            document.querySelector('.content-wrapper').classList.remove('auth', 'auth-img-bg', );
            document.querySelector('.content-wrapper').classList.remove('auth', 'lock-full-bg');
          }
          if((event['url'] == '/error-404') || (event['url'] == '/error-500') || (event['url'] == '/documentation')) {
            document.querySelector('.content-wrapper').classList.add('p-0');
          }
        } else {
          this.showSidebar = true;
          this.showNavbar = true;
          this.showFooter = true;
          this.showSettings = true;
          this.showSettings = false;
          document.querySelector('.main-panel').classList.remove('w-100');
          document.querySelector('.page-body-wrapper').classList.remove('full-page-wrapper');
          document.querySelector('.content-wrapper').classList.remove('auth', 'auth-img-bg');
          document.querySelector('.content-wrapper').classList.remove('p-0');
        }
      }
    });
  }

  ngOnInit() {
    // Scroll to top after route change
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });
  }
}
