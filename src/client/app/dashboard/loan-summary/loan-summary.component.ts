import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LoanItem } from './loan-summary.typedef';
import { DashboardResource } from './../dashboard.resource';
/**
 * 
 */
@Component({
    selector: 'sl-loan-summary',
    templateUrl: './loan-summary.component.html'
})
export class LoanSummaryComponent {
    resource: { [key: string]: string } = DashboardResource.loanSummary;
    @Input() loanItems: LoanItem[];
    constructor(private route: Router) { }

    ngOnInit() {
    }

    viewLoanDetails() {
        this.route.navigate(['/loandetails']);
    }
}
