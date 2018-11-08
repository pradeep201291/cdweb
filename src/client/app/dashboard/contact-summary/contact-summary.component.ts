import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ContactData } from './../dashboard.typedef';
import { ContactInfo } from './contact-summary.typedef';
import { DashboardResource } from './../dashboard.resource';
import { StateProviderService } from '../../core/state-provider.service';
import { Router } from '@angular/router';
/**
 * 
 */
@Component({
    selector: 'sl-contact-summary',
    templateUrl: './contact-summary.component.html'
})
export class ContactSummaryComponent {
    @Output() onExceptionNotifyHandler: EventEmitter<void> = new EventEmitter<void>();
    resource: { [key: string]: string } = DashboardResource.contact;

    /**
     * defaultItem
     * 
     * @type {ContactInfo}
     * @memberOf ContactSummaryComponent
     */
    defaultItem: ContactInfo;

    /**
     * 
     * 
     * @type {ContactInfo[]}
     * @memberOf ContactSummaryComponent
     */
    allContacts: ContactInfo[];
    canViewMoreContact: boolean = false;
    viewContactText: string;


    constructor(private stateProviderService: StateProviderService, private router: Router) {

    }

    /**
     * otherContacts
     * 
     * @type {ContactInfo[]}
     * @memberOf ContactSummaryComponent
     */

    get otherContacts(): ContactInfo[] {
        return this.allContacts.filter(e => !e.hide);
    }


    /**
     * 
     * 
     * 
     * @memberOf ContactSummaryComponent
     */
    @Input() set contactData(value: ContactData) {
        if (value && value.contacts.length > 0) {
            if (value.default_item) {
                this.defaultItem = value.default_item;
            } else {
                this.defaultItem = value.contacts[0];
            }
            this.viewContactText = DashboardResource.contact.viewContactSection;
            this.allContacts = value.contacts.filter(e => e.id !== this.defaultItem.id);
        }
    }

    /**
     * View the additional contact
     * 
     * 
     * @memberOf ContactSummaryComponent
     */
    viewMoreContact() {
        if ((this.allContacts && this.otherContacts && this.allContacts.filter(e => !e.hide).length !== 0
            && this.allContacts.length < 2
            && this.otherContacts.length === 0) || this.allContacts.length === 0 && this.otherContacts.length === 0) {
            this.onExceptionNotifyHandler.emit();
            return;
        }
        this.canViewMoreContact = !this.canViewMoreContact;
        if (this.canViewMoreContact) {
            if (this.otherContacts && this.otherContacts.length !== 0) {
                this.viewContactText = DashboardResource.contact.closeContactSection;
            }
            this.allContacts.forEach(e => e.hide = false);
        } else {
            this.viewContactText = DashboardResource.contact.viewContactSection;
        }
    }

    /**
     * Close the specific contact in view more list
     * 
     * @param {ContactInfo} otherContact
     * 
     * @memberOf ContactSummaryComponent
     */
    closeContact(otherContact: ContactInfo) {
        otherContact.hide = true;
        if (this.otherContacts.filter(e => !e.hide).length === 0) {
            this.canViewMoreContact = false;
            this.viewContactText = DashboardResource.contact.viewContactSection;
        }
    }

    /**
     * Redirect to message page for specific message conversation
     * 
     * @param {string} loanOfficerName
     * 
     * @memberOf ContactSummaryComponent
     */
    goToMessage(loanOfficerName: string) {
        this.stateProviderService.loanOfficerName = loanOfficerName;
        this.router.navigate(['/message']);
    }

    /**
     * Send mail to selected contact
     * 
     * @param {string} mail
     * 
     * @memberOf ContactSummaryComponent
     */
    sendMail(mail: string) {
        let url = 'mailto:' + mail;
        location.href = url;
    }
}
