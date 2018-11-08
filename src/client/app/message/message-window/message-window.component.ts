import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Message, Contact, ReceiverInfo } from './../shared/message-page.model';
import { MessageService } from './../shared/message-page.service';
import { Loan } from './../shared/loan.model';
import { MenuService } from '../../../sl-ui-framework/layout/service/menu.service';
import * as _ from 'lodash';
declare var $: any;
enum sortorder {
    asc = 0,
    desc
}
@Component({
    selector: 'message-window',
    templateUrl: './message-window.component.html'
})
export class MessageWindowComponent implements OnDestroy {


    private _conversation: Message[];
    private unreadMessages: Message[] = [];

    /**
     * 
     * 
     * 
     * @memberOf MessageWindowComponent
     */
    @Input() set conversation(value: Message[]) {
        this._conversation = value;
    }

    /**
    * Messages for the selected conversation
    * 
    * @type {Message[]}
    * @memberOf MessageWindowComponent
    */
    get conversation(): Message[] {
        this.unreadMessages = this._conversation.filter(each => each.status === 1 && !each.sent);
        return _.orderBy(this._conversation, [(e) => e.message_id], sortorder[sortorder.asc]);
    }

    @Output() onMessageSent = new EventEmitter<Contact>();

    /**
     * Checks whether any api action is in progress.
     * 
     * @private
     * @type {boolean}
     * @memberOf MessageWindowComponent
     */
    private inProgress: boolean = false;


    /**
     * 
     * 
     * @type {Loan}
     * @memberOf MessageWindowComponent
     */
    @Input() selectedLoan: Loan;

    /**
     * Input message
     * 
     * @type {string}
     * @memberOf MessageWindowComponent
     */
    message: string = '';

    /**
     * 
     * 
     * @type {Contact}
     * @memberOf MessageWindowComponent
     */
    selectedContact: Contact;

    @Input() set selectedContactData(value: Contact) {
        this.selectedContact = value;
        this.addContact = false;
        this.message = '';
    }

    private _addContact: boolean;

    /**
     * 
     * 
     * @type {boolean}
     * @memberOf MessageWindowComponent
     */
    set addContact(value: boolean) {
        this._addContact = value;
        if (!value) {
            // If it is hiding  reset the search term
            this.searchTerm = '';
        }
    }

    get addContact(): boolean {
        return this._addContact;
    }

    private _contacts: Contact[];

    /**
     * 
     * setter for the contacts
     * 
     * @memberOf MessageWindowComponent
     */
    @Input()
    set contacts(value: Contact[]) {
        this._contacts = value;
    }

    /**
         * Getter for the Contacts
         * 
         * @readonly
         * @type {Contact[]}
         * @memberOf MessageWindowComponent
         */
    get contacts(): Contact[] {
        return this._contacts;
    }

    /**
     * Gets the selected contacts for the conversation
     * 
     * @readonly
     * @type {Contact[]}
     * @memberOf MessageWindowComponent
     */
    get selectedContacts(): Contact[] {
        return this._contacts.filter(e => e.is_selected);
    }

    /**
     * 
     * 
     * @type {string}
     * @memberOf MessageWindowComponent
     */
    searchTerm: string = '';
    unreadMessageCount: number;
    firstUnreadMessageId: number;

    /**
     * Creates an instance of MessageWindowComponent.
     * 
     * @param {MessageService} messageService
     * 
     * @memberOf MessageWindowComponent
     */
    constructor(private messageService: MessageService, private menuService: MenuService) {

    }

    /**
     * Removes the contact from conversation
     * 
     * @param {Contact} contact
     * 
     * @memberOf MessageWindowComponent
     */
    removeContact(contact: Contact) {
        contact.is_selected = false;
        this.addContact = false;
    }

    /**
     * Adds the selected contact to the conversations
     * 
     * @param {Contact} contact
     * 
     * @memberOf MessageWindowComponent
     */
    addSelectedContact(contact: Contact) {
        contact.is_selected = true;
        this.addContact = false;
    }



    /**
     * Can Send button be enabled/disabled
     * 
     * @readonly
     * @type {boolean}
     * @memberOf MessageWindowComponent
     */
    get canSend(): boolean {
        return this.message && this.message.trim() !== '' && this.inProgress === false && this.getReceivers().length > 0;
    }

    /**
     * 
     * Adds a new receipient to the conversation. 
     * This will open the search window
     * 
     * @memberOf MessageWindowComponent
     */
    addRecipient() {
        /**
         * Show the window only if there are any more contacts other than already selected contacts
         */
        if (this.contacts.length > this.selectedContacts.length) {
            this.addContact = true;
        }
        this.stopEventPropagation();
    }

    private stopEventPropagation() {
        if (window.event) {
            window.event.stopPropagation();
        }
    }

    private getReceivers(): ReceiverInfo[] {
        return this.selectedContacts.map(e => {
            return {
                role: e.role,
                name: e.name
            };
        });
    }

    /**
     * 
     * Sends a message
     * 
     * @memberOf MessageWindowComponent
     */
    sendMessage() {
        if (this.getReceivers().length < 1) {
            $('#warningModal').modal('show');
        }
        if (this.canSend) {
            this.inProgress = true;
            let self = this;
            this.messageService.sendMessage({
                loan_num: this.selectedLoan.loan_num,
                src: this.selectedLoan.src,
                message: this.message,
                to: this.getReceivers()
            }).subscribe(res => {
                self.inProgress = false;
                if (res.data.status === 'success') {
                    this.message = '';
                    this.onMessageSent.emit(this.selectedContact);
                }
            }, err => {
                console.log(err);
                this.inProgress = false;
            });
        }

    }

    get firstUnreadMessage(): Message {
        if (this.conversation && this.conversation.length > 0) {
            return this.conversation.filter(e => e.status === 1 && e.sent === false)[0];
        }
        return null;
    }

    /**
     * 
     * 
     * 
     * @memberOf MessageWindowComponent
     */
    ngAfterViewInit() {
        this.updateMessageView();
    }
    updateMessageView() {
        let messageId: string;
        $('#message-history').scrollTop(0);
        if (this.conversation && this.conversation.length > 0) {
            if (this.selectedContact && this.selectedContact.unread_count > 0) {
                let firstUnreadMessage = this.conversation.filter(e => e.status === 1 && e.sent === false)[0];
                messageId = firstUnreadMessage.message_id.toString();
                this.firstUnreadMessageId = firstUnreadMessage.message_id;
                /**
                 * Mark the message as read once the tab is clicked
                 */
                if (this.unreadMessages.length > 0) {
                    // this.unreadMessageCount = this.unreadMessagesId.length;
                    let request = {
                        loan_num: this.selectedLoan.loan_num,
                        src: this.selectedLoan.src,
                        message_ids: this.unreadMessages.map(e => e.message_id)
                    };
                    this.messageService.markRead(request).subscribe((response) => {
                        if (response.data.status === 'success') {
                            this.contacts.filter(e => e.name === this.selectedContact.name).map(e => e.unread_count = 0);
                            this.messageService.getUnreadCount(this.selectedLoan.src, this.selectedLoan.loan_num)
                                .subscribe(result => {
                                    this.menuService.showMessage(result.data.total_unread_count);
                                }, error => {
                                    let errorMsg = error;
                                    console.log(errorMsg);
                                });
                        }
                    }, error => {
                        let errorMsg = error;
                        console.log(errorMsg);
                    });
                }

            } else {
                messageId = this.conversation[this.conversation.length - 1].message_id.toString();
            }
            let position = $(`#msg_${messageId}`).position().top;
            $('#message-history').scrollTop(position - 100);

        }
    }
    ngOnDestroy() {
        if ($('.modal-backdrop.in').is(':visible')) {
            $('.modal-backdrop.in').hide();
        }
    }
    onWarningModalClose() {
        $('#warningModal').modal('hide');
    }
}
