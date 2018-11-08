import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LoanInfo } from './../models/loan.response.model';
import {StateProviderService} from './../../core/state-provider.service';
/**
 This component is the upload document component for the Summary page.
 */
/**
 * 
 * 
 * @export
 * @class SummaryUploadComponent
 */
@Component({
    selector: 'upload-summary-view',
    templateUrl: './upload-summary.component.html',
})
export class SummaryUploadComponent {
    @Input() selectedLoan: LoanInfo;

    constructor(private route: Router, private state: StateProviderService) { }

    /**
     * 
     * Navigates to the dashboard page
     * 
     * @memberOf SummaryUploadComponent
     */
    loadDashboard() {
        this.route.navigate(['/dashboard']);
    }

    /**
     * 
     * Navigate to the upload document page.
     * 
     * @memberOf SummaryUploadComponent
     */
    uploadDocument() {
        this.state.needListUploadEntryRoute = '/summary';
        this.route.navigate(['upload']);
    }
}
