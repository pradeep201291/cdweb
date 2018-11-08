import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { SecurityPreference } from './security-preference.component';
import { ViewTwoFaSettingsComponent } from './view-twofa-settings/view-twofa-settings.component';
import { SecurityRoutingModule } from './security-preference.routing';
import { AuthModule } from './../../sl-ui-framework/auth/auth.module';
import { ProfileService } from './profile.service';
import { EditTwoFASettingsComponent } from './edit-twofa-settings/edit-twofa-settings.component';
import { PhoneNumberPipe } from './phone-number.pipe';
import { InfrastructureModule } from './../../sl-ui-framework/infrastructure/infrastructure.module';
// import { PhoneNumberMaskPipe } from './twofa-settings/phone-number-mask.pipe';
@NgModule({
  imports: [HttpModule, CommonModule, FormsModule, ReactiveFormsModule, SecurityRoutingModule, AuthModule,
     InfrastructureModule],
  declarations: [SecurityPreference, ViewTwoFaSettingsComponent, EditTwoFASettingsComponent, PhoneNumberPipe],
  exports: [SecurityPreference],
  providers: [ProfileService]
})
export class SecurityPreferenceModule { }
