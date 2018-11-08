import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from './../shared/shared.module';
import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { ChangePasswordPage } from './change-password.page';

import { AuthModule } from '../../sl-ui-framework/auth/auth.module';
import { PhoneNumberMaskPipe } from './phone-number-mask.pipe';
import { InfrastructureModule } from './../../sl-ui-framework/infrastructure/infrastructure.module';
@NgModule({
  imports: [HttpModule, CommonModule, FormsModule, ReactiveFormsModule, SharedModule, ChangePasswordRoutingModule, AuthModule,
    InfrastructureModule],
  declarations: [ChangePasswordPage, PhoneNumberMaskPipe],
  providers: []
})
export class ChangePasswordModule { }
