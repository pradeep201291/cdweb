import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForgotPasswordResource } from './unknown-device.resource';

import { AuthComponent } from './../auth-component-type.typedef';
import { ComponentLoadArgs, AuthErrorCode } from './../auth-item.typedef';
import { AuthEventArgs, AuthEventType, AuthCallBackEventArgs } from './../auth-event-args.typedef';

/**
 * 
 * 
 * @export
 * @class ForgotPasswordComponent
 */
@Component({
    selector: 'unknown-device',
    templateUrl: './unknown-device.component.html'
})
export class UnknownDeviceComponent extends AuthComponent implements OnInit {

    @Input() input: ComponentLoadArgs;
    @Output() output: EventEmitter<AuthEventArgs>;

    private unknownDeviceForm: FormGroup;
    authCallBackEventArgs: AuthCallBackEventArgs;
    private unknownDeviceFormErrors = {
        'otpCode': ''
    };


    get thisForm(): FormGroup {
        return this.unknownDeviceForm;
    }

    get formErrors(): any {
        return this.unknownDeviceFormErrors;
    }
    /**
     * Creates an instance of ForgotPasswordComponent.
     * 
     * @param {FormBuilder} fb
     * 
     * @memberOf ForgotPasswordComponent
     */
    constructor(private fb: FormBuilder) {
        super();
    }

    /**
     * 
     * 
     * 
     * @memberOf ForgotPasswordComponent
     */
    ngOnInit() {
        this.createForm();
        this.getUserDetails();
    }

    /**
     * 
     * 
     * @private
     * 
     * @memberOf UnknownDeviceComponent
     */
    private getUserDetails() {
        let self = this;
        this.output.emit({
            eventType: AuthEventType.GetCustomerContact,
            userName: this.input.userName,
            callBack: function (authCallBackEventArgs: AuthCallBackEventArgs) {
                self.authCallBackEventArgs = authCallBackEventArgs;
                // this authCallBackEventArgs.otpError
                // self.sendOTPCode();

            }
        });
    }

    /**
     * 
     * 
     * 
     * @memberOf UnknownDeviceComponent
     */
    sendOTPCode() {
        let self = this;
        if (this.authCallBackEventArgs && this.authCallBackEventArgs.phoneNumber) {
            self.unknownDeviceFormErrors.otpCode = '';
            this.output.emit({
                eventType: AuthEventType.SendVerificationCode,
                phoneNumber: this.authCallBackEventArgs.phoneNumber,
                userName: this.input.userName,
                callBack: (authCallBackEventArgs: AuthCallBackEventArgs) => {
                    if (!authCallBackEventArgs.otpSent) {
                        self.unknownDeviceFormErrors.otpCode = authCallBackEventArgs.otpError;
                    }
                }
            });
        }

    }

    private createForm() {
        this.unknownDeviceForm = this.fb.group({
            otpCode: ['', [Validators.required]],
            rememberMe: [false]
        });
    }

    /**
     * 
     * 
     * 
     * @memberOf UnknownDeviceComponent
     */
    onSubmit() {
        let self = this;
        if (this.unknownDeviceForm.valid) {
            this.output.emit({
                userName: this.input.userName,
                password: this.input.password,
                twofatoken: this.unknownDeviceForm.value.otpCode,
                phoneNumber: this.authCallBackEventArgs.phoneNumber,
                twofaenabled: true,
                eventType: AuthEventType.LogIn,
                rememberme: this.unknownDeviceForm.value.rememberMe ? true : false,
                callBack: (callBackEventArgs: AuthCallBackEventArgs) => {
                    self.unknownDeviceFormErrors.otpCode = callBackEventArgs.authErrorMessage;
                }
            });
        } else {
            super.validateForm(ForgotPasswordResource);
        }
    }
}
