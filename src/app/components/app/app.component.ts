import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'body',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  constructor(protected router: Router) {}
  ngOnInit() {
    // this.authService.login();
    this.fixScrollAfterRouteModal();
  }

  fixScrollAfterRouteModal() {
    this.router.events.subscribe( val => {
      const html = document.querySelector('html');
      html.className = '';
    });
  }
}
