import { SettingsService, _HttpClient } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import {
  SocialService,
  SocialOpenType,
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { environment } from '@env/environment';
import { StartupService } from '@core/startup/startup.service';
import * as JSEncryptModule from 'jsencrypt';
import { OpenIdConnectService } from '../../../open-id-connect.service';



@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
})
export class UserLoginComponent implements OnDestroy {
  form: FormGroup;
  // error = '';
  type = 0;
  loading = false;
  count = 0;
  interval$: any;

  publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnVVB8ECm9XgSAgQ10Gn2dyhFCVissWi2guj62999e/gOaUVjYxKmyEtZoZOKGhRIxgzvh3gD8OGm+cpjp8oTGlvIj2q788miw8GMKcgVa4bmF4eIkSksDI7SyHvr6maVt5Cdnpe/S7fqi9XoDf4hJXshQ7TXrO1EQ8F2/9MAeRiS5+AYNtnyxSLoXtkTGYKWqCYyuqqPPCn5LrXKATrbzZhigrrzptUdGvaRpTmEnQc7hyrGKDAfRwqOG/FIx9BlKiG61pBxqfBmwcoZVm3pJYdulLZ9Nq95Q8J/SGuJ1uFMwQdSq1BcbCUDV5v4wZOeIORwJj98J+FiHvizEA1DrwIDAQAB';

  constructor(
    fb: FormBuilder,
    private router: Router,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private settingsService: SettingsService,
    private socialService: SocialService,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
    private startupSrv: StartupService,
    private http: _HttpClient,
    public oidc: OpenIdConnectService
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required]],
      password: [null, Validators.required],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: [null, [Validators.required]],
      remember: [true],
    });
    modalSrv.closeAll();
  }

  // region: fields

  get userName() {
    return this.form.controls.userName;
  }
  get password() {
    return this.form.controls.password;
  }
  get mobile() {
    return this.form.controls.mobile;
  }
  get captcha() {
    return this.form.controls.captcha;
  }

  // endregion

  switch(ret: any) {
    this.type = ret.index;
  }

  // region: get captcha


  getCaptcha() {
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) clearInterval(this.interval$);
    }, 1000);
  }

  // endregion

  submit() {
    // this.error = '';
    if (this.type === 0) {
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
      this.password.markAsDirty();
      this.password.updateValueAndValidity();
      if (this.userName.invalid || this.password.invalid) return;
    } else {
      this.mobile.markAsDirty();
      this.mobile.updateValueAndValidity();
      this.captcha.markAsDirty();
      this.captcha.updateValueAndValidity();
      if (this.mobile.invalid || this.captcha.invalid) return;
    }

    // **注：** DEMO中使用 `setTimeout` 来模拟 http
    // 默认配置中对所有HTTP请求都会强制[校验](https://ng-alain.com/auth/getting-started) 用户 Token
    // 然一般来说登录请求不需要校验，因此可以在请求URL加上：`/login?_allow_anonymous=true` 表示不触发用户 Token 校验

    let jsencrypt = new JSEncryptModule.JSEncrypt();
    jsencrypt.setPublicKey(this.publicKey);
    let pwd = jsencrypt.encrypt(this.password.value);

    this.loading = true;
    this.http.post('Login?_allow_anonymous=true', {
      LoginName: this.userName.value,
      Password: pwd
    }).subscribe((d: any) => {

      this.loading = false;
      if (!d.Success) return;
      // 清空路由复用信息
      this.reuseTabService.clear();
      // 设置Token信息
      this.tokenService.set({
        token: d.Jwt,
        name: d.UserName,
        email: `843468011@qq.com`,
        id: d.ID,
        time: +new Date(),
      });
      // 重新获取 StartupService 内容，若其包括 User 有关的信息的话
      this.startupSrv.load().then(() => this.router.navigate(['/']));
      // 否则直接跳转
      // this.router.navigate(['/']);
    });
  }

  // region: social

  open(type: string, openType: SocialOpenType = 'href') {
    let url = ``;
    let callback = ``;
    if (environment.production)
      callback = 'https://ng-alain.github.io/ng-alain/callback/' + type;
    else callback = 'http://localhost:4200/callback/' + type;
    switch (type) {
      case 'auth0':
        url = `//cipchk.auth0.com/login?client=8gcNydIDzGBYxzqV0Vm1CX_RXH-wsWo5&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
      case 'github':
        url = `//github.com/login/oauth/authorize?client_id=9d6baae4b04a23fcafa2&response_type=code&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
      case 'weibo':
        url = `https://api.weibo.com/oauth2/authorize?client_id=1239507802&response_type=code&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
    }
    if (openType === 'window') {
      this.socialService
        .login(url, '/', {
          type: 'window',
        })
        .subscribe(res => {
          if (res) {
            this.settingsService.setUser(res);
            this.router.navigateByUrl('/');
          }
        });
    } else {
      this.socialService.login(url, '/', {
        type: 'href',
      });
    }
  }

  // endregion

  ngOnDestroy(): void {
    if (this.interval$) clearInterval(this.interval$);
  }
}
