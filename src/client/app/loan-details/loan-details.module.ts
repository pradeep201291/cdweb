import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { LoanDetailService } from './loan-details.service';

import { SharedModule } from './../shared/shared.module';
import { LoanDetailsRoutingModule } from './loan-details-routing.module';
import { LoanDetailsPage } from './loan-details.page';
import { BorrowerInfoComponent } from './borrower-info/borrower-info.component';
import { LoanInfoComponent } from './loan-info/loan-info.component';
import { ImportantDatesInfoComponent } from './important-dates-info/important-dates-info.component';
import { MonthlyPaymentInfoComponent } from './monthly-payment-info/monthly-payment-info.component';
import { LayoutModule } from './../../sl-ui-framework/layout/layout.module';

@NgModule({
  imports: [HttpModule, CommonModule, FormsModule, SharedModule, LoanDetailsRoutingModule, LayoutModule],
  declarations: [ LoanDetailsPage, BorrowerInfoComponent, LoanInfoComponent, ImportantDatesInfoComponent,
  MonthlyPaymentInfoComponent ],
  providers: [LoanDetailService]
})
export class LoanDetailsModule { }
