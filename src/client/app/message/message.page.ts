import { Component, OnInit, ViewChild } from '@angular/core';

import { MessageService } from './shared/message-page.service';

import { GetMessageResponse, SenderRequest, Contact, Message } from './shared/message-page.model';
import { GlobalConstants } from './../core/global-constant/global-constant';
import 'rxjs/add/observable/throw';
import { LoanInfo } from './../shared/service/models/GetMyLoansResponse';
import { Loan } from './shared/loan.model';
import { MenuService } from './../../sl-ui-framework/layout/service/menu.service';
import { StateProviderService } from './../core/state-provider.service';
import { MessageWindowComponent } from './message-window/message-window.component';
/**
 * 
 * 
 * @export
 * @class MessagePage
 * @implements {OnInit}
 */
@Component({
    selector: 'sl-message',
    templateUrl: 'message.page.html'
})

export class MessagePage implements OnInit {
    @ViewChild(MessageWindowComponent) msgWindow: MessageWindowComponent;
    /**
     * 
     * 
     * @type {Data}
     * @memberOf MessagePage
     */
    messageData: GetMessageResponse;

    /**
     * 
     * 
     * @type {Contact}
     * @memberOf MessagePage
     */
    selectedContact: Contact;

    /**
     * Conversation
     * 
     * @type {Message[]}
     * @memberOf MessagePage
     */
    conversation: Message[];

    /**
     * Selected Loan
     * 
     * @type {Loan}
     * @memberOf MessagePage
     */
    selectedLoan: Loan;

    contacts: Contact[];

    contactItem: Contact;
    /**
     * Creates an instance of ConverseMessagePage.
     * 
     * @param {MessageService} msgService
     * @param {MessageDataService} msgDataService
     * 
     * @memberOf ConverseMessagePage
     */
    constructor(private msgService: MessageService,
        private menuService: MenuService,
        private stateProviderService: StateProviderService) {

    }


    /**
     * 
     * 
     * 
     * @memberOf ConverseMessagePage
     */
    ngOnInit() {
        /**
         * @todo request object is framed instead of loan selector for release
         */
        this.selectedLoan = JSON.parse(sessionStorage.getItem(GlobalConstants.currentLoan));
        // this.getMessage(null, false);

        this.msgService.getUnreadCount(this.selectedLoan.src, this.selectedLoan.loan_num)
            .subscribe(response => {
                this.menuService.showMessage(response.data.total_unread_count);
            });
    }



    /*
    * 
    * @private
    * @param {Contact} selectedContact
    * @param {boolean} callBack
    * 
    * @memberOf MessagePage
    */
    private getMessage(selectedContact: Contact, callBack: boolean) {
        let request = {
            src: this.selectedLoan.src,
            loan_num: this.selectedLoan.loan_num
        };
        this.msgService.getMessageResponse(request).subscribe((response) => {
            this.messageData = response.data;
            this.messageData.contacts.forEach(eachContact => {
                eachContact.unread_count = this.messageData.messages
                    .filter(eachMessage => eachContact.name === eachMessage.from_name && eachMessage.status === 1).length;
            });
            if (!callBack) {
                this.contacts = this.messageData.contacts;
            }
            if (selectedContact) {
                this.onContactSelected(selectedContact, callBack);
            } else {
                this.onContactSelected(this.setContact(), callBack);
            }


        });
    }

    /**
     * 
     * Send message to selectd Loan Officer of multiple Loan Officer
     * 
     * @memberOf ConverseMessagePage
     */
    sendMessage(senderRequest: SenderRequest) {
        this.msgService.sendMessage(senderRequest).subscribe((response) => {
            if (response.data.status === 'success') {
                //  this.getMessage();
            }
        }, error => {
            let errorMsg = error;
            console.log(errorMsg);
        });
    }

    /**
     * 
     * 
     * @param {LoanInfo} selectedLoan
     * 
     * @memberOf ConverseMessagePage
     */
    onLoanSelected(selectedLoan: LoanInfo) {
        this.selectedLoan = { src: selectedLoan.src, loan_num: selectedLoan.loan_num };
        this.getMessage(null, false);
    }

    /**
     * 
     * 
     * @param {Contact} selectedContact
     * 
     * @memberOf MessagePage
     */
    onContactSelected(selectedContact: Contact, isCallBack: boolean) {
        if (!isCallBack) {
            this.contacts.forEach(e => {
                e.is_selected = false;
            });
        }
        if (selectedContact) {
            this.contacts.find(e => e.name === selectedContact.name).is_selected = true;
            this.selectedContact = selectedContact;
            this.conversation = this.messageData.messages
                .filter(e => e.from_name === selectedContact.name || e.to_name === selectedContact.name);
            /**
            * @todo refactor
            */
            this.conversation.forEach(e => {
                this.contacts.forEach(c => {
                    if (c.name === e.from_name) {
                        e.pic_url = c.pic_url;
                    }
                });
            });
        } else {
            /** User selected all conversations */
            this.conversation = this.messageData.messages;
            this.selectedContact = null;

            /**
             * @todo refactor
             */
            this.conversation.forEach(e => {
                this.contacts.forEach(c => {
                    if (c.name === e.from_name) {
                        e.pic_url = c.pic_url;
                    }
                });
            });
        }
        setTimeout(function () {
            if (this.msgWindow && this.msgWindow !== null) {
                this.msgWindow.updateMessageView();
            }
        }.bind(this), 0);

    }

    /**
     * On Message Sent
     * 
     * @param {Contact} selectedContact
     * 
     * @memberOf MessagePage
     */
    onMessageSent(selectedContact: Contact) {
        this.getMessage(selectedContact, true);
    }

    /**
     * @desc filter contact based on the loan officer selection made in summary page
     * loan officer name is updated in {stateProviderService.loanOfficerName}
     * 
     * @param {string} name
     * @returns {Contact}
     * 
     * @memberOf MessagePage
     */
    setContact(): Contact {
        let contactArray: Contact[];
        this.contactItem = null;
        let loanOfficerName = this.stateProviderService.loanOfficerName;
        if (loanOfficerName && loanOfficerName !== '') {
            if (this.messageData && this.messageData.contacts) {
                contactArray = this.messageData.contacts.filter((value, index, array) => {
                    if (value.name) {
                        return value.name.toLowerCase().trim() === loanOfficerName.toLowerCase().trim();
                    }
                });
            }
        }
        contactArray && contactArray.length > 0 ?
            this.contactItem = contactArray.shift() : this.contactItem = null;
        this.stateProviderService.loanOfficerName = '';
        return this.contactItem;
    }

}
