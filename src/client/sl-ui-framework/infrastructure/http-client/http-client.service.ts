import { Injectable } from '@angular/core';
import { Http, Headers, Response, ResponseContentType, URLSearchParams, RequestOptionsArgs, RequestMethod } from '@angular/http';
import { Router } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/mergeMap';

import { Observable } from 'rxjs/Observable';
import { ProgressBarService } from './../progress-bar/progress-bar.service';
import { DataStoreService } from '../data-store/data-store.service';

import { AppSettings } from './../../../app/core/global-configuration/settings';
import { HttpStatus } from './http-client.resource';
import { AuthResource } from './../../../sl-ui-framework/auth/auth.resource';
import { GlobalConstants } from '../../../app/core/global-constant/global-constant';

@Injectable()
export class StearnsHttpClient {
    private httpStatus: any;
    private isRefreshTokenNegotiationInProgress = false;
    private isRefreshTokenSubscription = new Subject<boolean>();
    private isRefreshTokenSubscription$ = this.isRefreshTokenSubscription.asObservable();
    constructor(private http: Http,
        private progressBarService: ProgressBarService,
        private appSettings: AppSettings,
        private dataStoreService: DataStoreService,
        private router: Router) {
        this.httpStatus = HttpStatus;
    }

    private configureHeaders(headers: Headers) {
        if (this.dataStoreService.getAccessToken()) {
            headers.append('X-user_name', this.dataStoreService.getUserId());
            headers.append('X-user_type', this.appSettings.security.userType);
            headers.append('X-user_session', this.dataStoreService.getClientSession());
            headers.append('Authorization', `Bearer ${this.dataStoreService.getAccessToken()}`);
            headers.append('X-dev_id', this.dataStoreService.getDeviceId());
            headers.append('X-dev_type', 'Web');
            headers.append('X-app_ver', this.appSettings.version);
            headers.append('X-company_code', this.dataStoreService.getCompanyCode());
            headers.append('X-broker_code', '');
            headers.append('X-client_request', this.dataStoreService.getRequestCount().toString());
        } else {
            headers.append('X-user_type', 'Consumer');
            headers.append('X-dev_id', this.dataStoreService.getDeviceId());
            headers.append('X-app_id', 'cons_web');
            headers.append('X-dev_type', 'Web');
            headers.append('X-app_ver', this.appSettings.version);
            headers.append('X-company_code', this.dataStoreService.getCompanyCode());
            headers.append('X-broker_code', '');
        }

    }

    private request(url: string, options: RequestOptionsArgs, data?: Object): Observable<Response> {
        if (data) {
            options.body = data;
        }
        return this.http.request(url, options).catch((error: any) => {
            if (error.status === this.httpStatus.TokenExpire) {
                if (this.isRefreshTokenNegotiationInProgress) {
                    return this.isRefreshTokenSubscription$.flatMap(res => {
                        if (options.headers.has('Authorization')) {
                            options.headers.delete('Authorization');
                            options.headers.append('Authorization', `Bearer ${this.dataStoreService.getAccessToken()}`);
                        }
                        return this.request(url, options, data);
                    });
                } else {
                    let serviceUrl = this.appSettings.serviceConfig.AuthUrl + this.appSettings.serviceConfig.loginUrl;
                    this.isRefreshTokenNegotiationInProgress = true;
                    /**request param is framed to get access token */
                    let urlSearchParams = new URLSearchParams();
                    urlSearchParams.append('grant_type', 'refresh_token');
                    urlSearchParams.append('refresh_token', this.dataStoreService.getRefreshToken());
                    /**caller for login url */
                    let headers: Headers;
                    headers = new Headers();
                    headers.append('X-user_name', this.dataStoreService.getUserId());
                    headers.append('X-user_type', 'Consumer');
                    headers.append('X-dev_id', this.dataStoreService.getDeviceId());
                    headers.append('X-dev_type', 'Web');
                    headers.append('Content-Type', 'application/x-www-form-urlencoded');
                    headers.append('X-app_ver', this.appSettings.version);
                    headers.append('X-company_code', this.dataStoreService.getCompanyCode());
                    headers.append('X-broker_code', '');

                    this.progressBarService.enqueue();
                    return this.http.post(serviceUrl, urlSearchParams.toString(), { headers: headers })
                        .flatMap((response: any) => {
                            this.progressBarService.dequeue();
                            let tokenInfo = response.json();
                            let accessToken = tokenInfo.access_token;
                            if (options.headers.has('Authorization')) {
                                options.headers.delete('Authorization');
                                options.headers.append('Authorization', `Bearer ${accessToken}`);
                            }
                            /**update the current user date in session store */
                            this.dataStoreService.updateUserDetails(tokenInfo);
                            this.isRefreshTokenNegotiationInProgress = false;
                            this.isRefreshTokenSubscription.next(true);
                            return this.request(url, options, data);
                        }).catch(err => {
                            this.clearSessionStore();
                            this.progressBarService.reset();
                            this.router.navigate(['/login']);
                            return Observable.throw(error);
                        });
                }
            }
            return Observable.throw(error);
        });

    }

    /**
      * This method enables and disables the progress bar with the respective service response
     * 
     * @param {string} url
     * @returns {Observable<Response>}
     * 
     * @memberOf StearnsHttpClient
     */
    get(url: string, responseType?: ResponseContentType, contentType?: string, configuredHeaders?: boolean): Observable<Response> {
        let headers = new Headers();
        if (!contentType || contentType === '') {
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
        } else {
            headers.append('Content-Type', contentType);

        }
        if (!configuredHeaders) {
            this.configureHeaders(headers);
        }
        this.progressBarService.enqueue();
        return this.request(url, {
            method: RequestMethod.Get,
            headers: headers,
            responseType: responseType
        }).map(response => {
            this.progressBarService.dequeue();
            return response;
        });
    }
    /**
     * This method enables and disables the progress bar with the respective service response
     * 
     * 
     * @param {string} url
     * @param {*} data
     * @returns {Observable<Response>}
     * 
     * @memberOf StearnsHttpClient
     */
    post(url: string, data: any, contentType?: string, headers?: Headers): Observable<Response> {
        if (!headers) {
            headers = new Headers();
        }
        this.configureHeaders(headers);
        if (!contentType || contentType === '') {
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
        }
        this.progressBarService.enqueue();
        return this.request(url, {
            method: RequestMethod.Post,
            headers: headers,
        }, data).map(response => {
            this.progressBarService.dequeue();
            return response;
        });
    }

    /**
     * 
     * 
     * @param {string} url
     * @returns {Observable<Response>}
     * 
     * @memberOf StearnsHttpClient
     */
    getAnnouncement(url: string): Observable<Response> {
        let headers = new Headers();
        headers.append('X-user_name', 'Consumer');
        headers.append('X-user_type', 'Consumer');
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('X-app_ver', this.appSettings.version);

        // this.progressBarService.toggle(true);
        this.progressBarService.enqueue();

        let request = this.http.get(url, {
            headers: headers
        });

        return request.map(response => {
            this.progressBarService.dequeue();
            return response;
        }).catch(e => {
            this.progressBarService.dequeue();
            return this.handleError(e);
        });
    }

    /**
     * 
     * 
     * @param {string} url
     * @param {*} data
     * @returns {Observable<Response>}
     * 
     * @memberOf StearnsHttpClient
     */
    login(url: string, data: any, userId?: string): Observable<Response> {
        let headers: Headers;
        headers = new Headers();
        if (userId) {
            headers.append('X-user_name', userId);
        }
        headers.append('X-user_type', 'Consumer');
        headers.append('X-dev_id', this.dataStoreService.getDeviceId(userId));
        headers.append('X-dev_type', 'Web');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('X-app_ver', this.appSettings.version);
        headers.append('X-company_code', this.dataStoreService.getCompanyCode());
        headers.append('X-broker_code', '');
        this.progressBarService.enqueue();
        let request = this.http.post(url, data, { headers: headers });
        return request.map(response => {
            this.progressBarService.dequeue();
            return response;
        }).catch(e => {
            this.progressBarService.dequeue();
            return this.handleError(e);
        });
    }

    logout(url: string, data: any, contentType?: string): Observable<Response> {
        let headers = new Headers();
        this.configureHeaders(headers);
        if (!contentType || contentType === '') {
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
        }
        this.progressBarService.enqueue();

        let request = this.http.post(url, data, {
            headers: headers
        });
        return request.map(response => {
            this.progressBarService.dequeue();
            return response;
        }).catch(e => {
            this.progressBarService.dequeue();
            return this.handleError(e);
        });
    }
    /**
     *  Reset Password Header declaration
     */
    resetPassword(url: string, data: any): Observable<Response> {
        let headers = new Headers();
        headers = this.getResetPasswordHeaders();
        this.progressBarService.enqueue();

        let request = this.http.post(url, data, {
            headers: headers
        });
        return request.map(response => {
            this.progressBarService.dequeue();
            return response;
        }).catch(e => {
            this.progressBarService.dequeue();
            return this.handleError(e);
        });
    }

    /**
     *  Reset Password Header Values
     */
    private getResetPasswordHeaders() {
        let headers: Headers;
        headers = new Headers();
        headers.append('X-user_type', 'Consumer');
        headers.append('X-dev_id', this.dataStoreService.getDeviceId());
        headers.append('X-dev_type', 'Web');
        headers.append('Content-Type', 'application/json');
        headers.append('X-user_session', this.dataStoreService.getClientSession());
        headers.append('X-app_ver', this.appSettings.version);
        headers.append('X-company_code', this.dataStoreService.getCompanyCode());
        headers.append('X-broker_code', '');
        return headers;
    }

    /**
     *  Set First Time Password header declaration
     */
    setFirstTimePassword(url: string, data: any): Observable<Response> {
        let headers = new Headers();
        headers = this.getFirstTimePasswordHeaders();
        this.progressBarService.enqueue();

        let request = this.http.post(url, data, {
            headers: headers
        });
        return request.map(response => {
            this.progressBarService.dequeue();
            return response;
        }).catch(e => {
            this.progressBarService.dequeue();
            return this.handleError(e);
        });
    }

    /**
     * Set First Time Password header values
     */
    private getFirstTimePasswordHeaders() {
        let headers: Headers;
        headers = new Headers();
        //  headers.append('X-user_name', );
        headers.append('X-user_type', 'Consumer');
        headers.append('X-dev_id', this.dataStoreService.getDeviceId());
        headers.append('X-dev_type', 'Web');
        headers.append('Content-Type', 'application/json');
        headers.append('X-app_ver', this.appSettings.version);
        headers.append('X-company_code', this.dataStoreService.getCompanyCode());
        headers.append('X-broker_code', '');
        return headers;
    }

    /**
 *  Reset Password Header declaration
 */
    customerContact(url: string, userName: string): Observable<Response> {
        let headers = new Headers();
        headers = this.getCustomerContactHeaders();
        headers.append('X-user_name', userName);
        this.progressBarService.enqueue();

        let request = this.http.get(url, {
            headers: headers
        });
        return request.map(response => {
            this.progressBarService.dequeue();
            return response;
        }).catch(e => {
            this.progressBarService.dequeue();
            return this.handleError(e);
        });
    }

    /**
     *  Reset Password Header Values
     */
    private getCustomerContactHeaders() {
        let headers: Headers;
        headers = new Headers();
        headers.append('X-user_type', 'Consumer');
        headers.append('X-app_id', 'cons_web');
        headers.append('X-dev_id', this.dataStoreService.getDeviceId());
        headers.append('X-dev_type', 'Web');
        headers.append('Content-Type', 'application/json');
        headers.append('X-app_ver', this.appSettings.version);
        headers.append('X-company_code', this.dataStoreService.getCompanyCode());
        headers.append('X-broker_code', '');
        return headers;
    }
    /**
     * 
     * 
     * @private
     * @param {(Response | any)} error
     * @returns
     * 
     * @memberOf StearnsHttpClient
     */
    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            let body = error.json() || '';
            let err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(error.json());

    }
    /**
     * 
     * 
     * @param {string} url
     * @param {string} token
     * @returns {Observable<Response>}
     * 
     * @memberOf StearnsHttpClient
     */
    getDocumentFromGoogleDrv(url: string, token?: string): Observable<Response> {
        let request: Observable<Response>;
        this.progressBarService.enqueue();
        /**request to download file object via selected file id */
        if (token) {
            let headers = new Headers();
            headers.append('Authorization', 'Bearer ' + token);

            request = this.http.get(url, {
                headers: headers
            });
        } else {
            /**request to download file content as blob */
            request = this.http.get(url, {
                headers: new Headers(),
                responseType: ResponseContentType.Blob
            });
        }
        return request.map(response => {
            this.progressBarService.dequeue();
            return response;
        }).catch(e => {
            this.progressBarService.dequeue();
            return this.handleError(e);
        });
    }
    clearSessionStore() {
        sessionStorage.removeItem(AuthResource.login.currentUser);
        sessionStorage.removeItem(GlobalConstants.currentLoan);
        sessionStorage.removeItem(GlobalConstants.currentMessageDO);
        sessionStorage.removeItem(GlobalConstants.borrower_request_count);
        sessionStorage.removeItem(GlobalConstants.borrower_session);
    }
}

