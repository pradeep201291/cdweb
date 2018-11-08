import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { AppSettings } from './../core/global-configuration/settings';
import { StearnsHttpClient } from './../../sl-ui-framework/infrastructure/http-client/http-client.service';
import { UpdateProfileRequest } from './update-profile-request.typedef';

@Injectable()
export class ProfileService {
    /**
     * Creates an instance of PreferenceService.
     * 
     * @param {StearnsHttpClient} http
     * @param {AppSettings} appSettings
     * 
     * @memberOf PreferenceService
     */
    constructor(private http: StearnsHttpClient, private appConfig: AppSettings) {
    }

    /**
     * 
     * 
     * @param {UpdateProfileRequest} request
     * @returns {Observable<boolean>}
     * 
     * @memberOf ProfileService
     */
    updateProfile(request: UpdateProfileRequest): Observable<boolean> {
        let updateProfileApi = this.appConfig.serviceConfig.AuthUrl + this.appConfig.serviceConfig.updateProfileUrl;
        return this.http.post(updateProfileApi, request)
                    .map(response => true)
                    .catch(err => Observable.throw(err));
    }
}
