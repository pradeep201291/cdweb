import { NgModule }      from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { SharedModule } from './../shared/shared.module';
import { LayoutModule } from './../../sl-ui-framework/layout/layout.module';

import { DashBoardPage } from './../dashboard/dashboard.page';
import { StatusSummaryComponent } from './../dashboard/status-summary/status-summary.component';
import { NeedListComponent } from './../dashboard/needlist/needlist.component';
import { LoanSummaryComponent } from './../dashboard/loan-summary/loan-summary.component';
import { MessageSummaryComponent } from './../dashboard/message-summary/message-summary.component';
import { ContactSummaryComponent } from './../dashboard/contact-summary/contact-summary.component';
import { NotificationSummaryComponent } from './../dashboard/notification-summary/notification-summary.component';


import { DashboardService } from  './dashboard.service';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  imports: [ HttpModule, CommonModule, FormsModule, SharedModule, DashboardRoutingModule, LayoutModule ],
  declarations: [ DashBoardPage, StatusSummaryComponent,
  LoanSummaryComponent, MessageSummaryComponent, ContactSummaryComponent,
  NotificationSummaryComponent, NeedListComponent],
  providers: [DashboardService]
})
export class DashboardModule { }
