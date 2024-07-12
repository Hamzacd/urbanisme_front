// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hmr: false,
  apiUrl: 'http://127.0.0.1:8000/api/',
  RESOURCES_LINK: 'http://127.0.0.1:8000',
  URL_USER_RSC: 'storage/users',
  URL_URB_RSC: 'storage/urb_requests',
  URL_SETTING_RSC: 'storage/settings',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
