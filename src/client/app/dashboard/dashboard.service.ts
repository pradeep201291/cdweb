import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {
    GetDashboardRequest, LoanData,
    GetFormWidgetRequest, GetFormWidgetResponse, GetDocutechSsoResponse, GetDocutechSsoRequest
} from './dashboard.typedef';
import { StearnsHttpClient } from './../../sl-ui-framework/infrastructure/http-client/http-client.service';
import { ApiResponse } from './../../sl-ui-framework/infrastructure/api-response.typedef';
import { AppSettings } from './../core/global-configuration/settings';


@Injectable()
/**
 * This service will call the apis for dashboard related informations
 */
export class DashboardService {

    /**
     * The constructor
     * @param  {Http} http - Angular HTTP Client
     * @param {AppConfig} appConfig = Application Configuration
     */
    constructor(private http: StearnsHttpClient, private appConfig: AppSettings) { }

    /**
     * get dashboard details for the loans
     * @returns 
     */
    getDashboardData(request: GetDashboardRequest): Observable<ApiResponse<LoanData>> {
        let serviceUrl = this.appConfig.serviceConfig.baseUrl +
            this.appConfig.serviceConfig.methodUrl +
            this.appConfig.serviceConfig.getDashboardForLoanUrl;
        return this.http.post(serviceUrl, request)
            .map((response: Response) => <ApiResponse<LoanData>>response.json());

    }

    /**
     * 
     * 
     * @param {GetFormWidgetRequest} request
     * @returns {Observable<GetFormWidgetResponse>}
     * 
     * @memberOf DashboardService
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
     * @memberOf DashboardService
     */
    getEsignSso(request: GetDocutechSsoRequest): Observable<GetDocutechSsoResponse> {
        let serviceUrl = this.appConfig.serviceConfig.baseUrl +
            this.appConfig.serviceConfig.getDocutechSso;
        return this.http.post(serviceUrl, request)
            .map((response: Response) => <GetDocutechSsoResponse>response.json());
    }

}
