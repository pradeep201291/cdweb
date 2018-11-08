import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { StearnsHttpClient } from './../../sl-ui-framework/infrastructure/http-client/http-client.service';
import { ApiResponse } from './../../sl-ui-framework/infrastructure/api-response.typedef';

import { LoanInfo } from './models/loan.response.model';
import { Summary } from './models/summary.response.model';
import { AppSettings } from './../core/global-configuration/settings';
import { GetFormWidgetResponse } from './models/asset-verification.response.model';
import { GetFormWidgetRequest, GetDocutechSsoResponse, GetDocutechSsoRequest } from './summary.typedef';

@Injectable()
/**
 * This service will call the apis for Loan related informations
 */
export class SummaryService {

    /**
     * The constructor
     * @param  {Http} http - Angular HTTP Client
     * @param {AppConfig} appConfig = Application Configuration
     */
    constructor(private http: StearnsHttpClient, private appConfig: AppSettings) { }

    /**
     * gets the loans for the logged in user
     * @returns {Observable<MyLoansResponseInfo>}
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
     * Gets the summary for loan
     * 
     * @returns {Observable<SummaryResponse>}
     * 
     * @memberOf SummaryService
     */
    getSummaryForLoan(loanId: string, src: string): Observable<ApiResponse<Summary>> {
        let summaryServiceUrl = this.appConfig.serviceConfig.baseUrl +
            this.appConfig.serviceConfig.methodUrl +
            this.appConfig.serviceConfig.getSummaryForLoanUrl;
        return this.http.post(summaryServiceUrl, { loan_num: loanId, src: src })
            .map((response: Response) => <ApiResponse<Summary>>response.json());

    }
    /**
     * 
     * 
     * @param {GetFormWidgetRequest} request
     * @returns {Observable<GetFormWidgetResponse>}
     * 
     * @memberOf SummaryService
     */
    getWidgetFormData(request: GetFormWidgetRequest): Observable<GetFormWidgetResponse> {
        let serviceUrl = this.appConfig.serviceConfig.baseUrl +
            this.appConfig.serviceConfig.getFormWidgetUrl;
        return this.http.post(serviceUrl, request)
            .map((response: Response) => <GetFormWidgetResponse>response.json());
    }
    /**
     * 
     * 
     * @param {GetDocutechSsoRequest} request
     * @returns {Observable<GetDocutechSsoResponse>}
     * 
     * @memberOf SummaryService
     */
    getEsignSso(request: GetDocutechSsoRequest): Observable<GetDocutechSsoResponse> {
        let serviceUrl = this.appConfig.serviceConfig.baseUrl +
            this.appConfig.serviceConfig.getDocutechSso;
        return this.http.post(serviceUrl, request)
            .map((response: Response) => <GetDocutechSsoResponse>response.json());
    }
}
