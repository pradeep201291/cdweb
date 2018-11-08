import { Injectable } from '@angular/core';
import { ResponseContentType, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AppSettings } from './../../app/core/global-configuration/settings';
import { StearnsHttpClient } from '../infrastructure/http-client/http-client.service';

import { LicenseAgreement, ConsentRequest } from './license-agreement.typedef';

@Injectable()
export class LicenseAgreementService {
    /** webpack replaces this variable*/
    private privatelblUrl = '@SL_APP_ROOT_PATH@assets/config/eula.json';
    constructor(private _http: StearnsHttpClient, private appConfig: AppSettings) {
    }

    getLicenseAgreement(): Observable<LicenseAgreement> {
        let result = this._http.get(this.privatelblUrl, ResponseContentType.Json, 'application/json', true)
            .map((response: Response) => {
                let licensAgreements = <LicenseAgreement[]>response.json();
                let companyCode = sessionStorage.getItem('company_code');
                return licensAgreements.find(e => e.companyCode === companyCode);
            });
        return result;
    }

    /**
     * Accepts the consent
     * 
     * @param {ConsentRequest} request
     * @returns {Observable<Response>}
     * 
     * @memberOf LicenseAgreementService
     */
    acceptConsent(request: ConsentRequest): Observable<Response> {
        let serviceUrl = this.appConfig.serviceConfig.AuthUrl + this.appConfig.serviceConfig.updateConsentUrl;
        return this._http.post(serviceUrl, {
            UserName: request.userName,
            EULAVersion: request.version,
            EULADate: request.date
        }).map((response: Response) => {
            return response;
        }).catch(err => {
            return Observable.throw(err);
        });

    }
}
