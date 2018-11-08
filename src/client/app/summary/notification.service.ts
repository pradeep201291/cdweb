import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {  UnreadNotificationCount } from './models/notification.response.model';
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
}
