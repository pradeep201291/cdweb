import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { StearnsHttpClient } from './../../../sl-ui-framework/infrastructure/http-client/http-client.service';
import { ApiResponse } from './../../../sl-ui-framework/infrastructure/api-response.typedef';
import { LoanInfo } from './models/loan.response.model';

import { AppSettings } from './../../../app/core/global-configuration/settings';
import { GlobalConstants } from './../../../app/core/global-constant/global-constant';

import { UnreadNotificationResponse } from './models/unread.notification.response.model';
/**
 * 
 * 
 * @export
 * @class LoanService
 */
@Injectable()
/**
 * This service will call the apis for Loan related informations
 */
export class LoanService {

    /**
     * The constructor
     * Creates an instance of LoanService.
     * 
     * @param {StearnsHttpClient} http
     * @param {AppSettings} appConfig
     * 
     * @memberOf LoanService
     */
    constructor(private http: StearnsHttpClient,
        private appConfig: AppSettings) { }

    /**
     * gets the loans for the logged in user
     * @returns {Observable<MyLoansResponseInfo>}
     */
    /**
     * 
     * 
     * @returns {Observable<MyLoansResponseInfo>}
     * 
     * @memberOf LoanService
     */
    getMyLoans(): Observable<ApiResponse<LoanInfo[]>> {
        let loanServiceUrl = this.appConfig.serviceConfig.baseUrl +
            this.appConfig.serviceConfig.methodUrl +
            this.appConfig.serviceConfig.getMyLoansUrl;
        return this.http.get(loanServiceUrl)
            .map((response: Response) => {
                let data = <ApiResponse<LoanInfo[]>>response.json();
                return data;
            });
    }

    /**
     * @description Get loan number from memory
     * 
     * @returns {string}
     * 
     * @memberOf LoanService
     */
    getLoanNumber(): string {
        let loan = JSON.parse(sessionStorage.getItem(GlobalConstants.currentLoan));
        return loan && loan.loan_num !== '' ? loan.loan_num : null;
    }

    /**
     * @description Gets the unread notification for the loan to all subscribers
     * 
     * @param {string} loanNumber
     * @param {string} src
     * 
     * @memberOf LoanService
     */
    getNotificationCountForLoan(loan_num: string, src: string): Observable<ApiResponse<UnreadNotificationResponse>> {
        let notificationCountUrl = this.appConfig.serviceConfig.baseUrl +
            this.appConfig.serviceConfig.getNotificationsCount;
        return this.http.post(notificationCountUrl, { 'src': src, 'loan_num': loan_num })
            .map((response: Response) => <ApiResponse<UnreadNotificationResponse>>response.json());
    }
}
