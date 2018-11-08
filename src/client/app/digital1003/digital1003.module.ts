import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Digital1003Page } from './digital1003.page';

import { AddressCompoent } from './shared/address/address.component';
import { DecisionComponent } from './shared/decision/decision.component';
import { MultichoiceComponent } from './shared/multichoice/multichoice.component';
import { UserInfoComponent } from './shared/user-info/user-info.component';

import { BorrowerPage } from './questionnaire/borrower/borrower.page';

import { BorrowerApplyWithSomeoneElse } from './questionnaire/borrower/apply-with-someone-else/apply-with-someone-else.component';
import { BorrowerApplyWithSpouse } from './questionnaire/borrower/apply-with-spouse/apply-with-spouse.component';
import { BorrowerSSN } from './questionnaire/borrower/borrower-ssn/borrower-ssn.component';
import { CurrentBorrowerAddress } from './questionnaire/borrower/borrower-current-address/borrower-current-address.component';
import { BorrowerServedMilitary } from './questionnaire/borrower/borrower-served-military/borrower-served-military.component';
import { BorrowerSpouseAddress } from './questionnaire/borrower/borrower-spouse-address/borrower-spouse-address.component';
import { BorrowerSpousePersonal } from './questionnaire/borrower/borrower-spouse-personal/borrower-spouse-personal.component';
import { BorrowerPreviousAddress } from './questionnaire/borrower/borrower-previous-address/borrower-previous-address.component';
import { BorrowerPullReport } from './questionnaire/borrower/borrower-pull-report/borrower-pull-report.component';

import { PropertyPage } from './questionnaire/property/property.page';
import { InterestedCityState } from './questionnaire/property/interested-city-state/interested-city-state.component';
import { PropertyUse } from './questionnaire/property/property-use/property-use.component';
import { PropertyType } from './questionnaire/property/property-type/property-type.component';
import { PropertyDownPayment } from './questionnaire/property/property-down-payment/property-down-payment.component';
import { PropertyValue } from './questionnaire/property/property-value/property-value.component';
import { PurchaseUnits } from './questionnaire/property/purchasing-units/purchasing-units.component';
import { PropertyIdentify } from './questionnaire/property/property-identify/property-identify.component';
import { PropertyAddress } from './questionnaire/property/property-address/property-address.component';

import { BorrowerReviewPage } from './questionnaire/borrower/review/borrower-review.page';

import { ReviewBorrowerCurrentAddress } from './questionnaire/borrower/review/borrower-current-address/borrower-current-address.component';
import { ReviewBorrowerMailingAddress } from './questionnaire/borrower/review/borrower-mailing-address/borrower-mailing-address.component';
import { ReviewBorrowerReviewPreviousAddress } from
  './questionnaire/borrower/review/borrower-previous-address/borrower-previous-address.component';
import { ReviewCoBorrowerInformation } from './questionnaire/borrower/review/co-borrower-information/co-borrower-information.component';
import { ReviewIsUsVeteran } from './questionnaire/borrower/review/is-us-veteran/is-us-veteran.component';
import { ReviewBorrowerDOBSSN } from './questionnaire/borrower/review/borrower-dob-ssn/borrower-dob-ssn.component';

import { PersonalPage } from './questionnaire/personal/personal.page';

import { CommunicationModule } from './../../sl-ui-framework/communication/communication.module';
import { Digital1003RoutingModule } from './digital1003-routing.module';
import { SharedModule } from './../shared/shared.module';
import { AuthModule } from './../../sl-ui-framework/auth/auth.module';
import { InfrastructureModule } from './../../sl-ui-framework/infrastructure/infrastructure.module';
import { LayoutModule } from './../../sl-ui-framework/layout/layout.module';

import { Digital1003HostDirective } from './digital1003-host-directive';

@NgModule({
  imports: [HttpModule,
    CommonModule,
    FormsModule,
    CommunicationModule,
    Digital1003RoutingModule,
    SharedModule,
    AuthModule,
    InfrastructureModule,
    LayoutModule,
    ReactiveFormsModule],

  declarations: [Digital1003Page,
    DecisionComponent,
    AddressCompoent,
    MultichoiceComponent,
    UserInfoComponent,
    PersonalPage,
    PropertyPage,
    PropertyUse,
    PropertyIdentify,
    InterestedCityState,
    PropertyType,
    PropertyDownPayment,
    PropertyValue,
    PurchaseUnits,
    PropertyAddress,
    BorrowerPage,
    BorrowerSSN,
    BorrowerApplyWithSomeoneElse,
    BorrowerApplyWithSpouse,
    CurrentBorrowerAddress,
    BorrowerServedMilitary,
    BorrowerSpouseAddress,
    BorrowerSpousePersonal,
    BorrowerPreviousAddress,
    BorrowerPullReport,
    BorrowerReviewPage,
    ReviewBorrowerCurrentAddress,
    ReviewBorrowerReviewPreviousAddress,
    ReviewBorrowerMailingAddress,
    ReviewCoBorrowerInformation,
    ReviewIsUsVeteran,
    ReviewBorrowerDOBSSN,
    Digital1003HostDirective],

  entryComponents: [PropertyIdentify,
    PropertyDownPayment,
    PropertyUse,
    PurchaseUnits,
    PropertyValue,
    PropertyType,
    PropertyIdentify,
    PropertyAddress,
    InterestedCityState]

})
export class Digital1003Module { }
