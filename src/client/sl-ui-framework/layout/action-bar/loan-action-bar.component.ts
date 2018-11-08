import { Component, OnInit, Output, EventEmitter, Input, HostListener } from '@angular/core';

import { LoanService } from './loan.service';

import { LoanInfo } from './models/loan.response.model';
import { GlobalConstants } from './../../../app/core/global-constant/global-constant';
import { MenuService } from './../../../sl-ui-framework/layout/service/menu.service';
import { MessageService } from '../../../app/message/shared/message-page.service';

@Component({
    selector: 'sl-loan-actionbar',
    templateUrl: 'loan-action-bar.component.html',
    providers: [LoanService]
})
export class LoanActionBarComponent implements OnInit {

    loan_collection: LoanInfo[];
    value: LoanInfo[];
    selectedLoanNumber: string;
    loanCount: number;
    isDropdownClicked: boolean = false;
    hasLoanItems: boolean = false;
    address: string;
    selectedLoan: LoanInfo;
    @Input() disableSelection: boolean;
    @Output() onLoanSelected = new EventEmitter<LoanInfo>();

    constructor(private loanService: LoanService,
        private menuService: MenuService,
        private messageService: MessageService
    ) {
        this.loan_collection = [];
    }

    ngOnInit() {
        this.loanService.getMyLoans()
            .subscribe((loanResponse) => {
                this.loan_collection = loanResponse.data;
                // If there is atleast one loan, the set the selected loan as the first loan.
                if (this.loan_collection && this.loan_collection.length && this.loan_collection.length > 0) {
                    this.loan_collection = this.loan_collection.filter(each => each.loan_num !== '');
                    let _selectedLoanNumber = this.loanService.getLoanNumber();
                    if (_selectedLoanNumber) {
                        this.selectedLoan = this.loan_collection.filter(each => each.loan_num === _selectedLoanNumber).shift();
                        this.getMessageUnreadCount(this.selectedLoan.loan_num, this.selectedLoan.src);
                        this.getNotificationUnreadCount(this.selectedLoan.loan_num, this.selectedLoan.src);
                    } else {
                        this.selectedLoan = this.loan_collection[0];
                        /**
                         * set the local storage value
                         */
                        sessionStorage.setItem(GlobalConstants.currentLoan, JSON.stringify(this.selectedLoan.loan_num));
                        this.getMessageUnreadCount(this.selectedLoan.loan_num, this.selectedLoan.src);
                        this.getNotificationUnreadCount(this.selectedLoan.loan_num, this.selectedLoan.src);
                    }

                    this.selectedLoan = this.loanService.getLoanNumber() ?
                        this.loan_collection.filter(each => each.loan_num === this.loanService.getLoanNumber()).shift()
                        : this.loan_collection[0];
                    this.selectedLoanNumber = this.selectedLoan.loan_num;
                    this.address = this.selectedLoan.prop_address + ',' + ' ' + this.selectedLoan.prop_city + ',' + ' ' +
                        this.selectedLoan.prop_state + ' ' + this.selectedLoan.prop_zip;
                    this.onLoanSelected.emit(this.selectedLoan);
                    this.loanCount = this.loan_collection.length;
                    this.hasLoanItems = true;
                }
            });
    }

    selectedLoanNum(loanNum: string) {
        this.value = this.loan_collection.filter(e => e.loan_num === loanNum);
        this.selectedLoanNumber = this.value[0].loan_num;
        this.selectedLoan = this.value[0];
        this.address = this.selectedLoan.prop_address + ',' + ' ' + this.selectedLoan.prop_city + ',' + ' ' +
            this.selectedLoan.prop_state + ' ' + this.selectedLoan.prop_zip;
        sessionStorage.setItem(GlobalConstants.currentLoan, JSON.stringify(this.value[0]));
        this.getNotificationUnreadCount(this.selectedLoan.loan_num, this.selectedLoan.src);
        this.getMessageUnreadCount(this.selectedLoan.loan_num, this.selectedLoan.src);
        this.onLoanSelected.emit(this.value[0]);
    }

    getNotificationUnreadCount(loan_num: string, src: string) {
        this.loanService.getNotificationCountForLoan(loan_num, src)
            .subscribe(response => {
                this.menuService.showNotification(response.data.total_unread_count);
            });
    }

    getMessageUnreadCount(loan_num: string, src: string) {
        this.messageService.getUnreadCount(src, loan_num)
            .subscribe(response => {
                this.menuService.showMessage(response.data.total_unread_count);
            });
    }

    onLoanDropDownClicked(event: any) {
        this.isDropdownClicked = !this.isDropdownClicked;
        if (event) {
            event.stopPropagation();
        }
    }

    @HostListener('document:click', ['$event'])
    hideSettings(event: any) {
        this.isDropdownClicked = false;
    }

}
