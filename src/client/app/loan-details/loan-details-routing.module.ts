/**
 * Routing configuration for Loan Details Page
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoanDetailsPage } from './loan-details.page';
import { AuthorizationGuard } from '../../././sl-ui-framework/auth/shared/guard';

const loanDetailsRoutes: Routes = [
    {
        path: 'loandetails', component: LoanDetailsPage,
        canActivate: [AuthorizationGuard]
    },
];

/**
 * 
 * 
 * @export
 * @class LoanDetailsRoutingModule
 */
@NgModule({
    imports: [
        RouterModule.forChild(loanDetailsRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class LoanDetailsRoutingModule {

}
