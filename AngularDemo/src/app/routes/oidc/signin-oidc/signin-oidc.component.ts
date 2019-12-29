import { Component, OnInit } from '@angular/core';
import { OpenIdConnectService } from '../../../open-id-connect.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ac-signin-oidc',
  templateUrl: './signin-oidc.component.html'
})


export class SignInOidcComponent implements OnInit {
  constructor(private oidc: OpenIdConnectService, private router: Router) { }
  ngOnInit() {
    var content
    var url = window.location.href;

    var array = url.split("#");
    if (array.length > 1) {
      content = array[1];
    }
    var search = window.location.search;
    if (search) {
      search = search.substr(1);
      var paras = search.split("&");
      paras.forEach(element => {
        content += element;
        content += ";"
      });
    }
    console.log('content', content);
    this.oidc.userLoaded$.subscribe(userLoaded => {
      if (userLoaded) {
        console.log("12312")
        this.router.navigate(['./user']);
      }
      else {
        console.log('error login');
      }
    });
    console.log("ahaahah")
    this.oidc.handleCallback();
  }
}
