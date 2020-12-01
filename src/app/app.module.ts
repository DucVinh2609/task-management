import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NG_ENTITY_SERVICE_CONFIG } from '@datorama/akita-ng-entity-service';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { QuillModule } from 'ngx-quill';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { MatIconModule } from '@angular/material/icon';
import { NZ_JIRA_ICONS } from '@trungk18/project/config/icons';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import en from '@angular/common/locales/en';

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NzSpinModule,
    NzDrawerModule,
    NzModalModule,
    MatIconModule,
    NzIconModule.forChild(NZ_JIRA_ICONS),
    environment.production ? [] : AkitaNgDevtools,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'task-management-client'),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AkitaNgRouterStoreModule,
    QuillModule.forRoot(),
    NzModalModule,
  ],
  providers: [
    {
      provide: NG_ENTITY_SERVICE_CONFIG,
      useValue: { baseUrl: 'https://jsonplaceholder.typicode.com' }
    },
    {
      provide: NZ_I18N,
      useValue: en_US
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
