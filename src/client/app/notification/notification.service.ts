import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { UnreadNotificationCount, Notification, NotificationCountInfo } from './notification.model';
import { AppSettings } from './../core/global-configuration/settings';
import { StearnsHttpClient } from './../../sl-ui-framework/infrastructure/http-client/http-client.service';
import { ApiResponse } from './../../sl-ui-framework/infrastructure/api-response.typedef';
@Injectable()
export class NotificationService {

    /**
     * constructor
     * @param http Http
     * @param appSettings AppSettings
     * 
     */
    constructor(private _http: StearnsHttpClient, private appSettings: AppSettings) {
    }

    /**
     * Gets the total notification Count
     * 
     * 
     * @returns {Observable<NotificationCountResponse>}
     * 
     * @memberOf NotificationService
     */
    getNotificationCount(): Observable<ApiResponse<NotificationCountInfo>> {
        let notificationCountUrl = this.appSettings.serviceConfig.baseUrl + this.appSettings.serviceConfig.getNotificationsCount;
        let result = this._http.get(notificationCountUrl)
            .map((response: Response) => response.json());
        return result;
    }

    /**
     * @description Gets the unread notification for the loan to all subscribers
     * 
     * @param {string} loanNumber
     * @param {string} src
     * 
     * @memberOf LoanService
     */
    getNotificationCountForLoan(loan_num: string, src: string): Observable<ApiResponse<UnreadNotificationCount>> {
        let notificationCountUrl = this.appSettings.serviceConfig.baseUrl +
            this.appSettings.serviceConfig.getNotificationsCount;
        return this._http.post(notificationCountUrl, { 'src': src, 'loan_num': loan_num })
            .map((response: Response) => <ApiResponse<UnreadNotificationCount>>response.json());
    }

    /**
        * Gets the broadcast notifications
        * 
        * @returns {Observable<NotificationForLoanResponse>}
        * 
        * @memberOf NotificationService
    */
    getBroadcastNotifications(): Observable<ApiResponse<Notification[]>> {
        let broadcastNotificationUrl = this.appSettings.serviceConfig.baseUrl + this.appSettings.serviceConfig.getNotificationsForLoan;
        return this._http.post(broadcastNotificationUrl, {
            loan_num: '',
            src: 'Empower'
        }).map((response: Response) => response.json());
    }

    /**
     * 
     * Gets the notification details for the loan
     * 
     * @param {string} loanNumber
     * @param {string} source
     * @returns {Observable<NotificationForLoanResponse>}
     * 
     * @memberOf NotificationService
     */
    getNotificationDetailsForLoan(loanNumber: string, source: string): Observable<ApiResponse<Notification[]>> {
        let notificationForLoanUrl = this.appSettings.serviceConfig.baseUrl + this.appSettings.serviceConfig.getNotificationsForLoan;

        return this._http.post(notificationForLoanUrl, {
            loan_num: loanNumber,
            src: source
        }).map((response: Response) => response.json());
    }

    /**
     * Mark notification as read
     * 
     * 
     * @param {number[]} loanNumbers
     * @returns
     * 
     * @memberOf NotificationService
     */
    markAsRead(loanNumbers: number[]) {
        let markAsReadApi = this.appSettings.serviceConfig.baseUrl + this.appSettings.serviceConfig.markNotificationAsRead;

        return this._http.post(markAsReadApi, { 'message_Id': loanNumbers })
            .map((response: Response) => response.json());
    }

    /**
     * Mark notification as unread
     * 
     * 
     * @param {number[]} loanNumbers
     * @returns
     * 
     * @memberOf NotificationService
     */
    markAsUnRead(loanNumbers: number[]) {
        let markAsUnReadApi = this.appSettings.serviceConfig.baseUrl + this.appSettings.serviceConfig.markNotificationAsUnRead;

        return this._http.post(markAsUnReadApi, { 'message_Id': loanNumbers })
            .map((response: Response) => response.json());
    }

    /**
     * Delete notification
     * 
     * @param {number[]} loanNumbers
     * @returns
     * 
     * @memberOf NotificationService
     */
    deleteNotification(loanNumbers: number[]) {
        let deleteNotificationApi = this.appSettings.serviceConfig.baseUrl + this.appSettings.serviceConfig.deleteNotification;

        return this._http.post(deleteNotificationApi, { 'message_Id': loanNumbers })
            .map((response: Response) => response.json());
    }


}
