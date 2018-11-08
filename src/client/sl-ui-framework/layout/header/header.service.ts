import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import { AppSettings } from './../../../app/core/global-configuration/settings';
import { StearnsHttpClient } from '../../infrastructure/http-client/http-client.service';

import { GetLogoutRequest } from '../../auth/auth.typedef';

/**
 * 
 * 
 * @export
 * @class HeaderService
 */
@Injectable()
export class HeaderService {

    /**
     * Creates an instance of HeaderService.
     * 
     * @param {StearnsHttpClient} http
     * @param {AppSettings} appConfig
     * 
     * @memberOf HeaderService
     */
    constructor(private http: StearnsHttpClient,
        private appConfig: AppSettings) { }


    /**
     * 
     * 
     * @param {GetLogoutRequest} request
     * @returns {Observable<boolean>}
     * 
     * @memberOf HeaderService
     */
    logout(request: GetLogoutRequest): Observable<boolean> {
        let serviceUrl = this.appConfig.serviceConfig.AuthUrl + this.appConfig.serviceConfig.logOutUrl;
        return this.http.post(serviceUrl, request)
            .map((response: Response) => {
                return true;
            }).catch(err => {
                return Observable.throw(err);
            });
    }
}
