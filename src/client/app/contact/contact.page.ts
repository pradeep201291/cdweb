/**
 * 
 *  
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ContactCardService } from './contact.service';
import { StateProviderService } from './../core/state-provider.service';

import { ContactDO, ContactData, LoanInfo } from './contact.typedef';


@Component({
    selector: 'contact-page',
    templateUrl: './contact.page.html',
})
export class ContactPage implements OnInit {
    contactData: ContactData;
    contactCollection: ContactDO[];

    _selectedLoan: LoanInfo;
    set selectedLoan(value: LoanInfo) {
        this._selectedLoan = value;
        this.contactData = null;
        if (this.selectedLoan.loan_num !== '') {
            this.getContactsByLoan();
        }
    }

    get selectedLoan() {
        return this._selectedLoan;
    }

    // medium size container array
    mdCardItemArr: Array<ContactDO[]>;

    // large size container array
    lgCardItemArr: Array<ContactDO[]>;

    constructor(private contactCardService: ContactCardService,
        private stateProviderService: StateProviderService,
        private router: Router) {
    }

    ngOnInit() { }

    onLoanSelected(selectedLoan: LoanInfo) {
        this.selectedLoan = selectedLoan;
    }

    getContactsByLoan() {
        this.contactCardService.getcontactCards({ loan_num: this.selectedLoan.loan_num, src: this.selectedLoan.src })
            .subscribe(contactResponse => {
                this.contactData = contactResponse.data;
                this.contactCollection = this.contactData.contact_list.contacts;
            });
    }

    /**
     * @desc EventEmitter for message page navigation
     * 
     * @param {string} loanOfficerName
     * 
     * @memberOf ContactPage
     */
    goToMessage(loanOfficerName: string) {
        this.stateProviderService.loanOfficerName = loanOfficerName;
        this.router.navigate(['/message']);
    }

}
