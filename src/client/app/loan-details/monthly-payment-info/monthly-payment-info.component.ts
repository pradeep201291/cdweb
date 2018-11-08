/**
 * monthly payment info
 */
import { Component, Input } from '@angular/core';

import { Loan } from './../loan-details.typedef';
import {LoanDetailsResource} from './../loan-details.resource';

/**
 * 
 * 
 * @export
 * @class MonthlyPaymentComponent
 */
@Component({
    selector: 'sl-monthly-info',
    templateUrl: './monthly-payment-info.component.html'

})

export class MonthlyPaymentInfoComponent {
    resource: { [key: string]: string } = LoanDetailsResource.loanInfo;
    @Input() loanDetails: Loan;
}
