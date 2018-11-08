import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { Response, URLSearchParams, Headers } from '@angular/http';
import { Encoder } from './url-param-encoder';
import { GetLoginResponse, GetLoginRequest, UserResponse } from './auth.typedef';
import { AppSettings } from './../../app/core/global-configuration/settings';
import { StearnsHttpClient } from '../infrastructure/http-client/http-client.service';

import { AuthResource } from './auth.resource';

/**
 * 
 * A Service for Authentication.
 * 
 * @export
 * @class AuthenticationService
 */
@Injectable()
export class AuthenticationService {


    constructor(private http: StearnsHttpClient,
        private appConfig: AppSettings) { }
    /**
   * 
   * 
   * @param {GetLoginRequest} request
   * @returns {Observable<GetLoginResponse>}
   * 
   * @memberOf AuthenticationService
   */
    /**
     * 
     * 
     * @param {GetLoginRequest} request
     * @returns {Observable<GetLoginResponse>}
     * 
     * @memberOf AuthenticationService
     */
    login(request: GetLoginRequest): Observable<GetLoginResponse> {
        let serviceUrl = this.appConfig.serviceConfig.AuthUrl + this.appConfig.serviceConfig.loginUrl;
        let body = this.getRequestBody(request);
        return this.http.login(serviceUrl, body, request.username)
            .map((response: Response) => {
                return this.getLoginResponse(response.json());
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
     * @memberOf ResetPasswordService
     */
    sendOTP(userID: string, phoneNumber: string): Observable<string> {
        let sendTokenApi = this.appConfig.serviceConfig.AuthUrl + this.appConfig.serviceConfig.sendTokenUrl;
        let headers = new Headers();
        headers.append('X-user_name', userID);
        return this.http.post(sendTokenApi, {
            UserId: userID,
            PhoneNumber: phoneNumber
        }, undefined, headers).map((response: Response) => response.json())
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
   * @memberOf AuthenticationService
   */
    getCustomerContact(userName: string): Observable<UserResponse> {
        let resetPasswordtApi = this.appConfig.serviceConfig.AuthUrl + this.appConfig.serviceConfig.getCustomerContactUrl +
            '?' + 'userid=' + userName;
        return this.http.customerContact(resetPasswordtApi, userName)
            .map((response: Response) => {
                let data = <UserResponse>response.json();
                return data;
            }).catch(err => {
                return Observable.throw(err);
            });
    }

    /**
     * 
     * 
     * @param {string} userName
     * @returns {Observable<string>}
     * 
     * @memberOf AuthenticationService
     */
    generatePassword(userName: string): Observable<string> {
        let resetPasswordtApi = this.appConfig.serviceConfig.AuthUrl + this.appConfig.serviceConfig.resetPassswordUrl +
            '?' + 'userId=' + userName;
        let headers = new Headers();
        headers.append('X-user_name', userName);
        return this.http.post(resetPasswordtApi, {}, undefined, headers).map(
            (response: Response) => {
                let data = <string>response.json();
                return data;
            }).catch(err => {
                return this.handleError(err);
            });
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        let errorStatus: number;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
            errorStatus = error.status;
        } else {
            errMsg = error.Message ? error.Message : error.toString();
            errorStatus = error.status ? error.status : undefined;
        }
        return Observable.throw({ errMsg, errorStatus });
    }


    /**
  * 
  * 
  * @param {GetLoginRequest} request
  * @returns
  * 
  * @memberOf AuthenticationService
  */
    private getRequestBody(request: GetLoginRequest) {
        let urlSearchParams = new URLSearchParams('', new Encoder());
        let request_header = AuthResource.req_param.login;
        if (request.rememberme === undefined || request.rememberme === null) {
            request.rememberme = false;
        }
        urlSearchParams.append(request_header.grant_type, request.grant_type);
        urlSearchParams.append(request_header.username, request.username);
        if (this.appConfig.encodePassword) {
            urlSearchParams.append(request_header.password, btoa(request.password));
            urlSearchParams.append(request_header.newpassword, request.newpassword ? btoa(request.newpassword) :
                request.newpassword);

        } else {
            urlSearchParams.append(request_header.password, request.password);
            urlSearchParams.append(request_header.newpassword, request.newpassword);
        }
        if (request.twofaenabled) {
            urlSearchParams.append(request_header.twofaenabled, request.twofaenabled.toString());
            urlSearchParams.append(request_header.twofatoken, request.twofatoken);
            urlSearchParams.append(request_header.rememberme, request.rememberme.toString());
            urlSearchParams.append(request_header.phonenumber, request.phonenumber);
        }
        if (request.eulaVersion) {
            urlSearchParams.append(request_header.eulaVersion, request.eulaVersion);
        }

        return urlSearchParams.toString();
    }

    /**
   * 
   * 
   * @param {Response} responseObj
   * @returns {GetLoginResponse}
   * 
   * @memberOf AuthenticationService
   */
    private getLoginResponse(responseObj: Response): GetLoginResponse {
        let response_param = AuthResource.response_param.login;
        if (responseObj !== null) {
            return {
                access_token: responseObj[response_param.access_token],
                token_type: responseObj[response_param.token_type],
                expires_in: responseObj[response_param.expires_in],
                refresh_token: responseObj[response_param.refresh_token],
                UserName: responseObj[response_param.userName],
                UserType: responseObj[response_param.userType],
                issued: responseObj[response_param.issued],
                expires: responseObj[response_param.expires],
                eulaError: responseObj[response_param.eulaError]
            };
        }
        return null;
    }
}

