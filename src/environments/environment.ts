// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { EnvironmentModel } from './environment-model';

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyDoIboevUaa9QK-oMkm9IR9YAqBb8JT_M0",
    authDomain: "task-management-client.firebaseapp.com",
    databaseURL: "https://task-management-client.firebaseio.com",
    projectId: "task-management-client",
    storageBucket: "task-management-client.appspot.com",
    messagingSenderId: "401820099249",
    appId: "1:401820099249:web:61e155ecc1fb4cbc2c7890",
    measurementId: "G-TF8EW3QSR6"
  },
  apiUrl: 'http://localhost:3000/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
