import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { ChangePasswordDetail, CustomerDetails } from './change-password.model';
import { AppSettings } from './../core/global-configuration/settings';
import { StearnsHttpClient } from './../../sl-ui-framework/infrastructure/http-client/http-client.service';

@Injectable()

export class ChangePasswordService {
    /**
     * constructor
     * @param http Http
     * @param appSettings AppSettings
     * 
     */
    constructor(private _http: StearnsHttpClient, private appSettings: AppSettings) {
    }

    getChangePasswordDetails(changePasswordDetails: ChangePasswordDetail, userId: string): Observable<string> {
        let changePasswordPageUrl = this.appSettings.serviceConfig.AuthUrl + this.appSettings.serviceConfig.changePasswordUrl;
        let oldPassword = changePasswordDetails.oldPassword;
        let newPassword = changePasswordDetails.newPassword;
        let confirmPassword = changePasswordDetails.confirmPassword;
        if (this.appSettings.encodePassword) {
            oldPassword = btoa(oldPassword);
            newPassword = btoa(newPassword);
            confirmPassword = btoa(confirmPassword);
        }
        return this._http.post(changePasswordPageUrl, {
            UserId: userId,
            Password: oldPassword,
            NewPassword: newPassword,
            ConfirmPassword: confirmPassword,
            TwoFactorToken: changePasswordDetails.TwoFactorToken && changePasswordDetails.TwoFactorToken != null
                && changePasswordDetails.TwoFactorToken.trim() !== '' ? changePasswordDetails.TwoFactorToken : '',
            RememberMe: changePasswordDetails.RememberMe

        }).map((response: Response) => response.json())
            .catch(err => {
                return Observable.throw(err);
            });
    }

    /**
     * 
     * 
     * @param {string} userName
     * @returns {Observable<UserResponse>}
     * 
     * @memberOf ChangePasswordService
     */
    getCustomerContact(userName: string): Observable<CustomerDetails> {
        let getCustomerContactAPI = this.appSettings.serviceConfig.AuthUrl + this.appSettings.serviceConfig.getCustomerContactUrl +
            '?' + 'userid=' + userName;
        return this._http.customerContact(getCustomerContactAPI, userName)
            .map((response: Response) => {
                let data = <CustomerDetails>response.json();
                return data;
            }).catch(err => {
                return Observable.throw(err);
            });
    }

    /**
     * 
     * 
     * @param {string} userID
     * @param {string} phoneNumber
     * @returns {Observable<string>}
     * 
     * @memberOf ChangePasswordService
     */
    sendOTP(userID: string, phoneNumber: string): Observable<string> {
        let sendCodeAPI = this.appSettings.serviceConfig.AuthUrl + this.appSettings.serviceConfig.sendTokenUrl;
        return this._http.post(sendCodeAPI, {
            UserId: userID,
            PhoneNumber: phoneNumber
        }).map((response: Response) => response.json())
            .catch(err => {
                return Observable.throw(err);
            });
    }

}
