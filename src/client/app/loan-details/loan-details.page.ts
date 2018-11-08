/**
 * Loan Details Page
 */
import { Component } from '@angular/core';

import { LoanInfo } from './../shared/service/models/GetMyLoansResponse';
import { LoanDetailService } from './loan-details.service';
import { Loan } from './loan-details.typedef';
import { LoanDetailsResource } from './loan-details.resource';

declare var $: any;

/**
 * 
 * 
 * @export
 * @class LoanDetailsPage
 */
@Component({
    selector: 'loan-details',
    templateUrl: './loan-details.page.html'

})

export class LoanDetailsPage {
    _selectedLoan: LoanInfo;
    loanData: Loan;
    test: string;
    isBorrower: boolean = true;
    isLoanDetails: boolean = true;
    isRateDetails: boolean = true;
    isImpDetails: boolean = true;
    resource: { [key: string]: string } = LoanDetailsResource.page;

    constructor(private loanDetailService: LoanDetailService) {
    }

    /**
    * Setter for selected loan
    */
    set selectedLoan(value: LoanInfo) {
        this._selectedLoan = value;
        // reset loan details page
        this.loanData = null;
        if (this.selectedLoan.loan_num !== '') {
            this.getLoanDetailsData();
        }
    }

    /**
     * Getter for selected loan
     */
    get selectedLoan() {
        return this._selectedLoan;
    }

    /**
    * Subscription for loan selected
    */
    onLoanSelected(selectedLoan: LoanInfo) {
        this.selectedLoan = selectedLoan;
        this.onLoanChange();

    }

    /**
     * 
     * This method will be called on every loan change for resetting the expand-collapse sections 
     * 
     * @memberOf LoanDetailsPage
     */
    onLoanChange() {
        this.isBorrower = true;
        this.isLoanDetails = true;
        this.isImpDetails = true;
        this.isRateDetails = true;
    }


    /**
     * 
     * 
     * 
     * @memberOf LoanDetailsPage
     */
    getLoanDetailsData() {
        this.loanDetailService.getMyLoanDetail({ loan_num: this.selectedLoan.loan_num, src: this.selectedLoan.src })
            .subscribe(loandetailsResponse => {
                this.loanData = loandetailsResponse.data.loan;
            });
    }

    onSign(type: string) {
        switch (type) {
            case 'borrower':
                this.isBorrower = !this.isBorrower;
                break;
            case 'loanDetails':
                this.isLoanDetails = !this.isLoanDetails;
                break;
            case 'rateDetails':
                this.isRateDetails = !this.isRateDetails;
                break;
            case 'impDetails':
                this.isImpDetails = !this.isImpDetails;
                break;
        }
    }

    /**
     *  ngAfterViewChecked to make divs of equal height after the page initialises
     */
    ngAfterViewChecked() {
        let viewWidth = $(window).width();
        if (viewWidth > 991) {
            let maxHeight = 0;
            $('.details-row-1').each(function () {
                if (($(this).height()) > maxHeight) {
                    maxHeight = $(this).height();
                }
            });
            $('.details-row-1').height(maxHeight);
        }
    }

}
