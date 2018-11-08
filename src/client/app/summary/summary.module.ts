import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SummaryPage } from '../././summary/summary.page';
import { SummaryEsignComponent } from './../summary/esign-document/esign-document.component';
import { SummaryNoPendingComponent } from './../summary/no-pending-item/no-pending-item.component';
import { SummaryUploadComponent } from './../summary/upload-summary/upload-summary.component';
import { AssetVerificationComponent } from './../summary/asset-verification/asset-verification.component';
import { LoanOptionComponent } from './../summary/loan-option/loan-option.component';
import { QuestionProgressComponent } from './../summary/digital1003-progress-track/digital1003-progress-track.component';

import { CommunicationModule } from './../../sl-ui-framework/communication/communication.module';
import { SummaryRoutingModule } from './summary-routing.module';
import { SharedModule } from './../shared/shared.module';
import { AuthModule } from './../../sl-ui-framework/auth/auth.module';
import { InfrastructureModule } from './../../sl-ui-framework/infrastructure/infrastructure.module';
import { LayoutModule } from './../../sl-ui-framework/layout/layout.module';
@NgModule({
  imports: [HttpModule, CommonModule, FormsModule,
    CommunicationModule, SummaryRoutingModule, SharedModule, AuthModule, InfrastructureModule, LayoutModule, ReactiveFormsModule],
  declarations: [SummaryPage, SummaryEsignComponent, SummaryNoPendingComponent,
    SummaryUploadComponent, AssetVerificationComponent, LoanOptionComponent, QuestionProgressComponent]
})
export class SummaryModule { }
