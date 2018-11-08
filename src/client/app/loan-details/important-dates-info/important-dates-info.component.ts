/**
 * Important date info
 */
import { Component, Input } from '@angular/core';

import { Loan } from './../loan-details.typedef';
import {LoanDetailsResource} from './../loan-details.resource';

/**
 * 
 * 
 * @export
 * @class ImportantDatesInfoComponent
 */
@Component({
    selector: 'sl-impdate-info',
    templateUrl: './important-dates-info.component.html'

})

export class ImportantDatesInfoComponent {
    resource: { [key: string]: string } = LoanDetailsResource.importantDatesInfo;
    @Input() loanDetails: Loan;
}
