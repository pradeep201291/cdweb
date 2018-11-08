/**
 * Document page component
 * 
 */
import { Component, ViewChild, OnDestroy } from '@angular/core';
import { LoanInfo } from './../shared/service/models/GetMyLoansResponse';
import { Loan } from './documents.model';

import { ViewDocumentPage } from './view-documents/view-documents.component';
import { DocumentService } from './documents.service';
declare var $: any;
/**
 * 
 * 
 * @export
 * @class DocumentPage
 */
@Component({
    selector: 'sl-documents',
    templateUrl: './documents.page.html',
    providers: []
})

export class DocumentPage implements OnDestroy {

    selectedLoan: Loan;


    @ViewChild(ViewDocumentPage)
    private viewDocumentComponent: ViewDocumentPage;
    /**
     * Get the selected Loan
     * 
     * @param {LoanInfo} selectedLoan
     * 
     * @memberOf DocumentPage
     */
    onLoanSelected(selectedLoan: LoanInfo) {
        this.selectedLoan = { src: selectedLoan.src, loan_num: selectedLoan.loan_num };
    }


    constructor(private documentService: DocumentService) {

    }

    /**
     * Refresh the page.
     * 
     * 
     * @memberOf DocumentPage
     */
    onUpload() {
        this.documentService.isDocumentUploaded = true;
        this.viewDocumentComponent.getDocuments();
    }
    ngOnDestroy(): void {
        if ($('.modal-backdrop.in').is(':visible')) {
            $('.modal-backdrop.in').hide();
        }
    }

}


