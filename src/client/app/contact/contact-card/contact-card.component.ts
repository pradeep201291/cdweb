import { Component, Input, EventEmitter, Output } from '@angular/core';

import { ContactDO } from './../contact.typedef';
import { ContactResource } from './../contact.resource';
@Component({
    selector: 'contact-card',
    templateUrl: './contact-card.component.html',
})

export class ContactCardComponent {
    resource: { [key: string]: string } = ContactResource.contact;

    /**
     * 
     * 
     * @type {Array<ContactDO[]>}
     * @memberOf LargeSizeContainerComponent
     */
    @Input() contactList: Array<ContactDO[]>;


    /**
     * 
     * 
     * 
     * @memberOf LargeSizeContainerComponent
     */
    @Output() onMessageSelected = new EventEmitter<string>();


    /**
     * Send mail to selected contact
     * 
     * @param {string} mail
     * 
     * @memberOf ContactCardComponent
     */
    sendMail(mail: string) {
        let url = 'mailto:' + mail;
        location.href = url;
    }

    /**
     * @desc EventEmitter for message page navigation
     * 
     * @param {string} loanOfficerName
     * 
     * @memberOf LargeSizeContainerComponent
     */
    goToMessage(loanOfficerName: string) {
        this.onMessageSelected.emit(loanOfficerName);
    }
}
