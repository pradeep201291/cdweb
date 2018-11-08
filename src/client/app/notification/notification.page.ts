/**
 * Notification page component
 *
 */
import { Component, OnInit } from '@angular/core';
import 'rxjs/add/observable/forkJoin';

import { LoanInfo } from './../shared/service/models/GetMyLoansResponse';
import { NotificationService } from './notification.service';
import { Notification } from './notification.model';
import { MenuService } from '../../sl-ui-framework/layout/service/menu.service';

export enum StatusType {
    Unread = 1,
    Read = 2,
    Delete = 3
}

enum NotificationType {
    LoanNotification = 1,
    BroadCast = 4
}

@Component({
    selector: 'sl-notification',
    templateUrl: './notification.page.html',
    providers: [NotificationService]
})
export class NotificationPage implements OnInit {
    selectedLoan: LoanInfo;
    showLoanNotification: boolean = true;
    selectAllNotification: boolean;
    loanNotifications: Notification[];
    selectedTab: string;
    isNotificationLoaded: boolean = false;
    private _filteredNotifications: Notification[];


    /**
     * This is the setter for all the filteredNotifications
     * 
     * 
     * @memberOf NotificationPage
     */
    set filteredNotifications(value: Notification[]) {
        this._filteredNotifications = value;
    }

    /**
     * Read the value of filteredNotifications and get it arranged as per read and unread items.
     * 
     * @type {Notification[]}
     * @memberOf NotificationPage
     */
    get filteredNotifications(): Notification[] {
        return this._filteredNotifications.sort((a, b) => {
            /**
             * sort by unread
             */
            if (a.status_type < b.status_type) {
                return -1;
            }
            if (a.status_type > b.status_type) {
                return 1;
            }
            if (a.message_date > b.message_date) {
                return -1;
            }
            if (a.message_date < b.message_date) {
                return 1;
            }
            return 0;
        });
    }
    /* The Constructor
        * @ notificationService - The Notification Service
    */
    constructor(private notificationService: NotificationService, private menuService: MenuService) {
    }

    /**
     * This method is loaded when we load the notification page component
     */
    ngOnInit() {
        this.selectAllNotification = false;
        this.filteredNotifications = [];
        // this.notificationService.getBroadcastNotifications().subscribe(result => {
        //     this.`broadCastN`otifications = result.data.filter(e => e.notification_type !== 1);
        // });

    }


    /**
     * This consists of the selected notifications
     * 
     * @param {Notification} notification
     * 
     * @memberOf NotificationPage
     */
    selectNotification(notification: Notification) {

        // If the select all is already checked, then uncheck the selectall checkbox
        this.selectAllNotification = !(this.filteredNotifications.filter(each => !each.isSelected).length > 0);
    }

    /**
     * This method by default selects all the notifications
     */
    selectAllNotifications() {
        this.filteredNotifications.forEach(each => each.isSelected = this.selectAllNotification);
    }

    canHandle(type: string) {
        if (type === 'loan') {
            return this.loanNotifications.filter(each => each.isSelected).length > 0;
        }
    }

    /**
     * This method is called to update the list of notifications whenever a read, unread or delete method is executed.
     */
    private updateList(type: StatusType) {
        this.filteredNotifications.filter(each => each.isSelected)
            .forEach(each => each.status_type = type);
        this.filteredNotifications = this.filteredNotifications.filter(each => each.status_type !== StatusType.Delete);
        this.filteredNotifications.filter(each => each.isSelected = false);
        this.selectAllNotification = false;

        this.notificationService.getNotificationCountForLoan(this.selectedLoan.loan_num, this.selectedLoan.src)
            .subscribe(response => {
                this.menuService.showNotification(response.data.total_unread_count);
            });

    }
    /**
     * Delete selected notifications
     */
    deleteSelected() {
        /**
       * @todo change once broadcast notification features and api are stable
      */
        let selectedMessages =
            this.filteredNotifications.filter(each => each.isSelected).map(each => each.message_id);
        if (selectedMessages.length > 0) {
            this.notificationService.deleteNotification(selectedMessages).subscribe(response => {
                if (response.data.status === 'Success') {
                    this.updateList(StatusType.Delete);
                }
            });
        }
    }

    /**
     * Read selected notifications
     */
    readSelected() {
        /**
       * @todo change once broadcast notification features and api are stable
      */
        let selectedMessages =
            this.filteredNotifications.filter(each => each.isSelected).map(each => each.message_id);
        if (selectedMessages.length > 0) {
            this.notificationService.markAsRead(selectedMessages).subscribe(response => {
                if (response.data.status === 'Success') {
                    this.updateList(StatusType.Read);
                }
            });

        }
    }

    /**
     * Unread selected notifications
     */
    unreadSelected() {
        /**
       * @todo change once broadcast notification features and api are stable
      */
        let selectedMessages =
            this.filteredNotifications.filter(each => each.isSelected).map(each => each.message_id);
        if (selectedMessages.length > 0) {
            this.notificationService.markAsUnRead(selectedMessages).subscribe(response => {
                if (response.data.status === 'Success') {
                    this.updateList(StatusType.Unread);
                }
            });
        }
    }
    /**
    * Subscription for loan selected
    */
    onLoanSelected(selectedLoan: LoanInfo) {
        this.selectedLoan = selectedLoan;
        this.showLoanNotification = true;
        this.notificationService
            .getNotificationDetailsForLoan(selectedLoan.loan_num, selectedLoan.src).subscribe(result => {
                this.loanNotifications = result.data;
                this.showNotification('loan');
            });
    }

    /**
     * showNotifications
     */
    showNotification(type: string) {
        // Reset selections.
        this.selectAllNotification = false;
        this.selectedTab = type;

        this.showLoanNotification = true;
        this.filteredNotifications = this.loanNotifications
            .filter(each => each.status_type !== StatusType.Delete
                && each.notification_type === NotificationType.LoanNotification);
        this.filteredNotifications.forEach(x => x.isSelected = false);
        this.isNotificationLoaded = true;
    }

}
