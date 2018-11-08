import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { LoanData, GetLoanDetailRequest } from './loan-details.typedef';
import { AppSettings } from './../core/global-configuration/settings';
import { StearnsHttpClient } from './../../sl-ui-framework/infrastructure/http-client/http-client.service';
import { ApiResponse } from './../../sl-ui-framework/infrastructure/api-response.typedef';

@Injectable()
export class LoanDetailService {
    // private loanDetailUrl = '/assets/mockData/loanDetail.json';

    /**
     * constructor
     * @param http Http
     * @param appSettings AppSettings
     * 
     */
    constructor(private http: StearnsHttpClient, private appSettings: AppSettings) {
    }

     /**
      * 
      * @description get the loan details response from API
      * @param {GetLoanDetailRequest} request
      * @returns {Observable<LoanDetailResponse>}
      * 
      * @memberOf LoanDetailService
      */
     getMyLoanDetail(request: GetLoanDetailRequest): Observable<ApiResponse<LoanData>> {
        let serviceUrl = this.appSettings.serviceConfig.baseUrl +
                            this.appSettings.serviceConfig.methodUrl +
                            this.appSettings.serviceConfig.getLoanDetailUrl;
        return this.http.post(serviceUrl, request)
            .map((response: Response) => {
               let data =  <ApiResponse<LoanData>>response.json();
              return data;
            });
    }




}
