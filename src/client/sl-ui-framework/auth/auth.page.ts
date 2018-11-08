import { Component, AfterViewInit, ViewChild, ComponentFactoryResolver, EventEmitter } from '@angular/core';

import { Router } from '@angular/router';

import { AuthHostDirective } from './auth-host.directive';

import { AuthenticationService } from './auth.service';
import { AuthComponentProviderService } from './auth-component-provider.service';
import { AuthComponent } from './auth-component-type.typedef';
import { ComponentLoadArgs, AuthErrorCode } from './auth-item.typedef';
import { AuthEventArgs, AuthEventType, AuthCallBackEventArgs } from './auth-event-args.typedef';
import { LicenseAgreementService } from './license-agreement.service';
import { LicenseAgreement } from './license-agreement.typedef';

import { JWTHelper, PayLoadData } from './auth.typedef';
import { AuthResource } from './auth.resource';
import { DataStoreService } from './../infrastructure/data-store/data-store.service';

/**
 * 
 * 
 * @export
 * @class AuthPage
 * @implements {OnInit}
 */
@Component({
    selector: 'sl-auth',
    templateUrl: './auth.page.html'

})

export class AuthPage implements AfterViewInit {

    private _componentLoadArgs: ComponentLoadArgs;
    private _currentEula: LicenseAgreement;

    private set componentLoadArgs(value: ComponentLoadArgs) {
        this._componentLoadArgs = value;
        this.loadComponent();
    }

    private get componentLoadArgs(): ComponentLoadArgs {
        return this._componentLoadArgs;
    }

    @ViewChild(AuthHostDirective) authHost: AuthHostDirective;

    constructor(
        private _componentFactoryResolver: ComponentFactoryResolver,
        private router: Router,
        private authService: AuthenticationService,
        private authComponentProviderService: AuthComponentProviderService,
        private licenseAgreementService: LicenseAgreementService,
        private dataStoreService: DataStoreService) {
    }

    ngOnInit() {
        this.licenseAgreementService.getLicenseAgreement()
            .subscribe(response => this._currentEula = response);
    }
    /**
     * On Initialized
     * 
     * 
     * @memberOf AuthPage
     */
    ngAfterViewInit() {
        if (sessionStorage.getItem(AuthResource.login.currentUser)) {
            this.router.navigate(['/summary']);
        } else {
            this.componentLoadArgs = {
                userName: '',
                password: '',
                errorCode: AuthErrorCode.None
            };
        }

    }

    /**
     * Load the component based on authentication response
     * 
     * 
     * @memberOf AuthPage
     */
    loadComponent() {
        let componentToLoad = this.authComponentProviderService.getAuthComponent(this.componentLoadArgs);
        if (componentToLoad) {
            let componentFactory = this._componentFactoryResolver.resolveComponentFactory(componentToLoad.component);
            let viewContainerRef = this.authHost.viewContainerRef;
            viewContainerRef.clear();
            let componentRef = viewContainerRef.createComponent(componentFactory);
            /**
             * Set the loaded component as the component ref.
             */
            (<AuthComponent>componentRef.instance).input = this.componentLoadArgs;
            (<AuthComponent>componentRef.instance).output = new EventEmitter<AuthEventArgs>();
            (<AuthComponent>componentRef.instance).output
                .subscribe((eventArgs: AuthEventArgs) => {
                    this.handleEvent(eventArgs);
                });

        }

    }

    /**
     * Generic Event Handler from child components
     * 
     * @param {AuthEventArgs} event
     * 
     * @memberOf AuthPage
     */
    handleEvent(eventArgs: AuthEventArgs) {
        switch (eventArgs.eventType) {
            case AuthEventType.LogIn: this.handleLogin(eventArgs);
                break;
            case AuthEventType.SendVerificationCode: this.handleSendVerificationCode(eventArgs);
                break;
            case AuthEventType.ChangeTemporaryPassword: this.handleLogin(eventArgs);
                break;
            case AuthEventType.GetCustomerContact: this.handleGetCustomerContact(eventArgs);
                break;
            case AuthEventType.AcceptAgreement: this.handleAcceptConsent(eventArgs);
                break;
            case AuthEventType.DeclineAgreement: this.handleDeclineConsent(eventArgs);
                break;
            default: break;
        }
    }

    /**
     * 
     * 
     * @param {AuthEventArgs} eventArgs
     * 
     * @memberOf AuthPage
     */
    private handleAcceptConsent(eventArgs: AuthEventArgs) {
        this.licenseAgreementService.acceptConsent({
            userName: eventArgs.userName,
            date: new Date(),
            version: this._currentEula.version
        }).subscribe(res => {
            if (eventArgs.rememberme) {
                this.dataStoreService.setDeviceId();
            }
            this.router.navigate(['/summary']);
        }, err => eventArgs.callBack({
            consentError: true
        }));
    }


    private handleDeclineConsent(eventArgs: AuthEventArgs) {
        this.componentLoadArgs = {
            errorCode: AuthErrorCode.None,
            userName: '',
            password: '',
            authErrorMessage: ''
        };
    }


    /**
     * 
     * 
     * @param {AuthEventArgs} eventArgs
     * 
     * @memberOf AuthPage
     */
    handleGetCustomerContact(eventArgs: AuthEventArgs) {
        let authCallBackEventArgs: AuthCallBackEventArgs = {
            otpSent: false,
            twofaenabled: false
        };

        this.authService.getCustomerContact(eventArgs.userName)
            .subscribe(customerContact => {
                if (customerContact && customerContact.TwoFactorEnabled) {
                    authCallBackEventArgs.twofaenabled = customerContact.TwoFactorEnabled;
                    authCallBackEventArgs.phoneNumber = customerContact.PhoneNumber;
                    authCallBackEventArgs.maskedPhoneNumber = this.getMaskedPhoneNumber(authCallBackEventArgs.phoneNumber);
                    if (eventArgs.callBack) {
                        eventArgs.callBack(authCallBackEventArgs);
                    }
                } else {
                    authCallBackEventArgs.twofaenabled = false;
                    if (eventArgs.callBack) {
                        eventArgs.callBack(authCallBackEventArgs);
                    }
                }
            });
    }


    /**
     * 
     * 
     * @param {AuthEventArgs} eventArgs
     * 
     * @memberOf AuthPage
     */
    private handleSendVerificationCode(eventArgs: AuthEventArgs) {
        let authCallBackEventArgs: AuthCallBackEventArgs = {
            otpSent: false,
            phoneNumber: eventArgs.phoneNumber,
            maskedPhoneNumber: this.getMaskedPhoneNumber(eventArgs.phoneNumber)
        };
        this.authService.sendOTP(eventArgs.userName, eventArgs.phoneNumber)
            .subscribe(response => {
                authCallBackEventArgs.otpSent = true;
                if (eventArgs.callBack) {
                    eventArgs.callBack(authCallBackEventArgs);
                }
            }, error => {
                /**
                 * @todo, change the error handling appropriately
                 */
                authCallBackEventArgs.otpSent = false;
                authCallBackEventArgs.otpError = 'Problem in sending error code. Please try again';
                if (eventArgs.callBack) {
                    eventArgs.callBack(authCallBackEventArgs);
                }
            });
    }

    /**
     * Event Handler for login.
     * 
     * @param {AuthEventArgs} eventArgs
     * 
     * @memberOf AuthPage
     */
    private handleLogin(eventArgs: AuthEventArgs) {
        this.authService.login({
            grant_type: 'password',
            password: eventArgs.password,
            username: eventArgs.userName,
            newpassword: eventArgs.newPassword,
            phonenumber: eventArgs.phoneNumber,
            rememberme: eventArgs.rememberme ? true : false,
            twofaenabled: eventArgs.twofaenabled,
            twofatoken: eventArgs.twofatoken,
            eulaVersion: this._currentEula.version
        }).subscribe(response => {
            let payLoadData = this.getTokenParsed(response.access_token);

            let userDetails = JSON.stringify(
                {
                    UserId: eventArgs.userName,
                    FirstName: payLoadData.FirstName,
                    LastName: payLoadData.LastName,
                    email: payLoadData.email,
                    access_token: response.access_token,
                    refresh_token: response.refresh_token,
                    expires_in: response.expires_in,
                    issued: response.issued,
                    expires: response.expires,
                });
            if (response.eulaError) {
                this.componentLoadArgs = {
                    errorCode: AuthErrorCode.ConsentVersionMismatch,
                    userName: eventArgs.userName,
                    password: eventArgs.password,
                    userDetails: userDetails,
                    rememberMe: eventArgs.rememberme,
                    eulaSrc: this._currentEula.consent
                };
            } else {
                /**
                 * @todo move this to a separate service.
                 */
                sessionStorage.setItem(AuthResource.login.currentUser, userDetails);
                if (eventArgs.rememberme) {
                    this.dataStoreService.setDeviceId();
                }
                this.router.navigate(['/summary']);
            }

        }, err => {
            if (+err.error) {
                this.componentLoadArgs = {
                    errorCode: +err.error,
                    password: eventArgs.password,
                    userName: eventArgs.userName,
                    authErrorMessage: err.error_description
                };

            } else {
                /** Invalid grant */
                this.componentLoadArgs = {
                    errorCode: AuthErrorCode.invalid_grant,
                    userName: '',
                    password: '',
                    authErrorMessage: err.error_description
                };
            }
            if (eventArgs.callBack) {
                eventArgs.callBack({
                    errorCode: this.componentLoadArgs.errorCode,
                    authErrorMessage: this.componentLoadArgs.authErrorMessage
                });
            }
        });
    }

    /**
     * 
     * 
     * @private
     * @param {string} phoneNumber
     * @returns
     * 
     * @memberOf AuthPage
     */
    private getMaskedPhoneNumber(phoneNumber: string) {
        let charArray = Array.from(phoneNumber);
        charArray[2] = charArray[3] = charArray[4] = charArray[5] = 'x';
        let city = charArray.slice(0, 3);
        let number = charArray.slice(3);

        return ('(' + city + ')' + '-' + number.slice(0, 3) + '-' + number.slice(3)).trim().replace(/,/g, '');
    }

    /**
     * @todo move to a separate service
     * 
     * @param {string} jwtToken
     * @returns {PayLoadData}
     * 
     * @memberOf AuthPage
     */
    private getTokenParsed(jwtToken: string): PayLoadData {
        let jwtHelper = new JWTHelper();
        let result = jwtHelper.decodeToken(jwtToken);
        if (result !== '') {
            return {
                unique_name: result['unique_name'],
                FirstName: result['First Name'],
                LastName: result['Last Name'],
                email: result['email']

            };
        }
        return null;
    }
}
