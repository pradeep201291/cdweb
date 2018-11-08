import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { HttpModule, RequestOptions, BaseRequestOptions } from '@angular/http';
import { UrlSerializer } from '@angular/router';


import { LayoutModule } from './../sl-ui-framework/layout/layout.module';


import { AppComponent } from './app.component';

import { routing, appRoutingProviders } from './app.routing';
import { AuthModule } from './../sl-ui-framework/auth/auth.module';
import { InfrastructureModule } from './../sl-ui-framework/infrastructure/infrastructure.module';

import { DashboardModule } from './dashboard/dashboard.module';
import { SummaryModule } from './summary/summary.module';
import { NotificationModule } from './notification/notification.module';
import { ContactModule } from './contact/contact.module';
import { LoanDetailsModule } from './loan-details/loan-details.module';
import { ChangePasswordModule } from './change-password/change-password.module';


import { StearnsHttpClient } from './../sl-ui-framework/infrastructure/http-client/http-client.service';

import { CoreModule } from './core/core.module';
import { MessageModule } from './message/message.module';

import { DocumentUploadModule } from './document-upload/document-upload.module';
import { DocumentModule } from './documents/documents.module';
import { CommunicationModule } from './../sl-ui-framework/communication/communication.module';

import { Digital1003Module } from './digital1003/Digital1003.module';

import { SecurityPreferenceModule } from './security-preference/security-preference.module';
import { LowerCaseUrlSerializer } from './url.serializer';
import { AppErrorHandler } from './app.errorhandler';
/**
 * All the API requests needs to be configured here
 */
class StearnsApiRequestOptions extends BaseRequestOptions {

  /**
   * The constructor
   */
  constructor() {
    super();
    this.configureHeaders();
  }

  /**
   * Add all the headers here
   */
  private configureHeaders(): void {
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }
}


/**
 * 
 */
@NgModule({
  imports: [BrowserModule, HttpModule, routing, LayoutModule,
    ContactModule, InfrastructureModule, AuthModule, DashboardModule,
    SummaryModule, NotificationModule, DocumentModule,
    LoanDetailsModule, CoreModule, MessageModule, ChangePasswordModule,
    DocumentUploadModule, SecurityPreferenceModule, CommunicationModule, Digital1003Module],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [Title, appRoutingProviders, StearnsHttpClient,
    { provide: RequestOptions, useClass: StearnsApiRequestOptions },
    { provide: UrlSerializer, useClass: LowerCaseUrlSerializer},
    { provide: ErrorHandler, useClass: AppErrorHandler }
  ]
})
export class AppModule { }
