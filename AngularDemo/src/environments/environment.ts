// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const idpBase = 'http://localhost:5008';
export const apiBase = 'http://localhost:5009';
export const angularBase = 'http://localhost:4200';


export const environment = {
  SERVER_URL: `http://localhost:8000/`,
  production: false,
  useHash: true,
  hmr: false,
  openIdConnectSettings: {
    authority: `${idpBase}`,
    client_id: '2',
    redirect_uri: `${angularBase}/#/signin-oidc`,
    post_logout_redirect_uri: `${angularBase}`,
    // silent_redirect_uri: `${angularBase}/user/redirect_silentrenew`,
    scope: 'api1 openid profile address email phone',
    response_type: 'code',
    //automaticSilentRenew: true,
    client_secret: 'client2secret'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
