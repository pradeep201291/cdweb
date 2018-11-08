import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthPage } from './auth.page';
import { LoginComponent } from './login/login.component';
import { ChangeTemporaryPasswordComponent } from './change-temporary-password/change-temporary-password.component';

import { AuthHostDirective } from './auth-host.directive';
import { AuthComponentProviderService } from './auth-component-provider.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

import { AuthenticationService } from './auth.service';

import { CommunicationModule } from './../communication/communication.module';
import { AuthRoutingModule } from './auth-routing.module';
import { UnknownDeviceComponent } from './unknown-device/unknown-device.component';

import { AuthorizationGuard } from './shared/guard';
import { LicenseAgreementService } from './license-agreement.service';
import { LicenseAgreementComponent } from './eula/license-agreement.component';
import { InfrastructureModule } from './../infrastructure/infrastructure.module';
/**
 * 
 * 
 * @export
 * @class AuthModule
 */
@NgModule(
  {
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      CommunicationModule,
      AuthRoutingModule,
      InfrastructureModule
    ],
    declarations: [
      // PhonePipe,
      AuthPage,
      LoginComponent,
      AuthHostDirective,
      ChangeTemporaryPasswordComponent,
      ForgotPasswordComponent,
      UnknownDeviceComponent,
      LicenseAgreementComponent
      // ResetPasswordComponent,
      // StrengthBarComponent,
      // UserRegistrationComponent,
      // DeviceRegistrationComponent
    ],
    providers: [
      AuthenticationService,
      AuthComponentProviderService,
      AuthorizationGuard,
      LicenseAgreementService
      // SharedService
    ],
    entryComponents: [
      LoginComponent,
      ChangeTemporaryPasswordComponent,
      UnknownDeviceComponent,
      LicenseAgreementComponent
    ],
    exports: [
      AuthPage
      // ResetPasswordComponent,
      // StrengthBarComponent,
      // UserRegistrationComponent,
      // PhonePipe,
      // DeviceRegistrationComponent
    ]
  }
)
export class AuthModule { }
