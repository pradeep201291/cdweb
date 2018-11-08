/**
 * Loan info
 */
import { Component, Input } from '@angular/core';

import { Loan } from './../loan-details.typedef';
import {LoanDetailsResource} from './../loan-details.resource';

/**
 * 
 * 
 * @export
 * @class LoanInfoComponent
 */
@Component({
    selector: 'sl-loan-info',
    templateUrl: './loan-info.component.html'

})

export class LoanInfoComponent {
    resource: { [key: string]: string } = LoanDetailsResource.loanInfo;
    @Input() loanDetails: Loan;
}
