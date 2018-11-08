import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Contact } from './../shared/message-page.model';
import { Loan } from './../shared/loan.model';

/**
 * 
 * 
 * @export
 * @class ContactListComponent
 */
@Component({
    selector: 'contact-list',
    templateUrl: './contact-list.component.html'
})
export class ContactListComponent {
    /**
     * The contact list
     * 
     * @type {Contact[]}
     * @memberOf ContactListComponent
     */
    @Input() contacts: Contact[];

    /**
     * 
     * 
     * @type {Contact}
     * @memberOf ContactListComponent
     */
    @Input() selectedContact: Contact;

    /**
     * The loan number 
     * 
     * @type {number}
     * @memberOf ContactListComponent
     */
    @Input() selectedLoan: Loan;


    /**
     * Output parameter when contact is selected
     * 
     * 
     * @memberOf ContactListComponent
     */
    @Output() onContactSelected = new EventEmitter<Contact>();

    /**
     * When the user selects the contact
     * 
     * @param {Contact} item
     * 
     * @memberOf ContactListComponent
     */
    selectContact(contact: Contact) {
        /**
         * If the user selects any contact other than All Coversations,
         * there will be a value associated
         */
        if (this.selectedContact !== contact) {
            this.selectedContact = contact;
            this.onContactSelected.emit(contact);
        }
    }

}
