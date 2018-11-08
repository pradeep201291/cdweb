/**
 * Borrower info
 */
import { Component, Input } from '@angular/core';

import { Loan } from './../loan-details.typedef';
import {LoanDetailsResource} from './../loan-details.resource';

/**
 * 
 * 
 * @export
 * @class BorrowerInfoComponent
 */
@Component({
    selector: 'sl-borrower-info',
    templateUrl: './borrower-info.component.html'

})

export class BorrowerInfoComponent {
    resource: { [key: string]: string } = LoanDetailsResource.borrowerInfo;
    @Input() loanDetails: Loan;
}
