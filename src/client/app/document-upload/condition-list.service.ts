import { Injectable } from '@angular/core';

import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { StearnsHttpClient } from './../../sl-ui-framework/infrastructure/http-client/http-client.service';
import { ApiResponse } from './../../sl-ui-framework/infrastructure/api-response.typedef';


import { AppSettings } from './../core/global-configuration/settings';
import { Condition, LoanData, GetNeedListRequest } from './models/condition-list.model';

/**
 * 
 * 
 * @export
 * @class ConditionListService
 */
@Injectable()
export class ConditionListService {

    /**
     * Creates an instance of ConditionListService.
     * 
     * @param {StearnsHttpClient} http
     * @param {AppSettings} appSettings
     * 
     * @memberOf ConditionListService
     */
    constructor(private http: StearnsHttpClient, private appSettings: AppSettings) {

    }

    /**
     * Gets the loan details for the loan and src
     * 
     * @param {string} loan_num
     * @param {string} src
     * @returns {Observable<LoanDetails>}
     * 
     * @memberOf LoanDetailService
     */
    getConditions(loan_num: string, src: string): Observable<ApiResponse<Condition[]>> {
        /**
         * @todo need a service which will return the address for the loan
         */
        let serviceUrl = this.appSettings.serviceConfig.baseUrl +
            this.appSettings.serviceConfig.methodUrl +
            this.appSettings.serviceConfig.getConditionsUrl;

        return this.http.post(serviceUrl, { 'loan_num': loan_num, 'src': src })
            .map((response: Response) => response.json());
    }

    /**
     * 
     * 
     * @param {GetNeedListRequest} request
     * @returns {Observable<ApiResponse<LoanData>>}
     * 
     * @memberOf ConditionListService
     */
    getNeedListData(request: GetNeedListRequest): Observable<ApiResponse<LoanData>> {
        let serviceUrl = this.appSettings.serviceConfig.baseUrl +
            this.appSettings.serviceConfig.methodUrl +
            this.appSettings.serviceConfig.getNeedListUrl;
        return this.http.post(serviceUrl, request)
            .map((response: Response) => <ApiResponse<LoanData>>response.json());

    }
}
