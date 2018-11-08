import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthComponent } from './../auth-component-type.typedef';
import { ComponentLoadArgs, AuthErrorCode } from './../auth-item.typedef';
import { AuthEventArgs, AuthEventType, AuthCallBackEventArgs } from './../auth-event-args.typedef';
import { ChangeTemporaryPasswordResource } from './change-temporary-password.resource';
import { invalidPasswordValidator, passwordMatch } from './invalid-password-validator';
import { DataStoreService } from './../../infrastructure/data-store/data-store.service';
import * as _ from 'lodash';
@Component({
    selector: 'change-temporary-password',
    templateUrl: './change-temporary-password.component.html'
})
export class ChangeTemporaryPasswordComponent extends AuthComponent
    implements OnInit {


    @Input() input: ComponentLoadArgs;
    @Output() output: EventEmitter<AuthEventArgs>;
    authCallBackEventArgs: AuthCallBackEventArgs;
    private changePassWordForm: FormGroup;
    private canChangeTwoFA: boolean;
    private isDeviceAlreadyRegistered: boolean = true;
    private changePassWordFormErrors = {
        'newPassword': '',
        'confirmPassword': '',
        'phoneNumber': '',
        'otpCode': ''
    };

    get thisForm(): FormGroup {
        return this.changePassWordForm;
    }

    get formErrors(): any {
        return this.changePassWordFormErrors;
    }

    constructor(private fb: FormBuilder, private dataStoreService: DataStoreService) {
        super();
    }


    ngOnInit() {
        this.createForm();
        this.authCallBackEventArgs = {
            otpSent: false
        };
        if (this.input.errorCode === AuthErrorCode.UserNeedsToResetTheTemporaryPasswordGeneratedByForgetPasswordAction) {
            this.canChangeTwoFA = false;
            this.getCustomerContact();

        } else if (this.input.errorCode === AuthErrorCode.UserNeedsToResetTheTemporaryPassword) {
            this.canChangeTwoFA = true;
        }
    }

    /**
     * 
     * 
     * @private
     * 
     * @memberOf ChangeTemporaryPasswordComponent
     */
    private getCustomerContact() {
        this.output.emit({
            userName: this.input.userName,
            password: this.input.password,
            eventType: AuthEventType.GetCustomerContact,
            callBack: (authCallBackEventArgs: AuthCallBackEventArgs) => {
                this.authCallBackEventArgs = authCallBackEventArgs;
                if (this.authCallBackEventArgs.twofaenabled) {
                    this.composeOtpValidators(true);
                    this.input.twoFAEnabled = true;
                    this.input.phoneNumber = this.authCallBackEventArgs.phoneNumber;
                    this.getOtpCode(this.authCallBackEventArgs.phoneNumber);

                    /** Device is already registered. */
                    this.isDeviceAlreadyRegistered = this.dataStoreService.hasDeviceId(this.input.userName);
                } else {
                    this.composeOtpValidators(false);
                    this.input.phoneNumber = null;
                }
            }
        });
    }
    /**
     * 
     * 
     * 
     * @memberOf ChangeTemporaryPasswordComponent
     */
    private createForm() {
        this.changePassWordForm = this.fb.group({
            newPassword: ['', [
            ]],
            confirmPassword: ['', [
            ]],
            isTwoFaEnabled: [false],
            phoneNumber: [''],
            otpCode: [''],
            rememberMe: [this.input.errorCode === AuthErrorCode.UserNeedsToResetTheTemporaryPassword]
        });

        let newPassword = this.changePassWordForm.controls['newPassword'];
        let confirmPassword = this.changePassWordForm.controls['confirmPassword'];
        confirmPassword
            .setValidators(Validators.compose([
                Validators.required,
                passwordMatch(newPassword)
            ]));

        newPassword
            .setValidators(Validators.compose([
                Validators.required,
                passwordMatch(confirmPassword),
                invalidPasswordValidator()
            ]));
        this.changePassWordForm.valueChanges.subscribe(data => {
            /**
             * Update the validators of otp code
             */
            this.composeOtpValidators(data.isTwoFaEnabled);
            if (newPassword.value && confirmPassword.value && newPassword.value !== '' && confirmPassword.value !== ''
                && newPassword.value === confirmPassword.value) {
                let invalidError = newPassword.getError('invalidPassword');
                let newMatchError = newPassword.getError('passwordDoesntMatch');
                let confirmMatchError = confirmPassword.getError('passwordDoesntMatch');
                this.changePassWordFormErrors.confirmPassword = '';
                this.changePassWordFormErrors.newPassword = '';
                if (!invalidError && _.isUndefined(invalidError)) {
                    newPassword.setErrors(null);
                    confirmPassword.setErrors(null);
                }
                if ((newMatchError && !_.isUndefined(newMatchError)) && (confirmMatchError && !_.isUndefined(confirmMatchError))) {
                    confirmPassword.setErrors(null);
                }

            }
            this.resetErrors();
        });

    }

    resetErrors() {
        this.changePassWordFormErrors = {
            'newPassword': '',
            'confirmPassword': '',
            'phoneNumber': '',
            'otpCode': '',

        };
        this.input.otpError = '';
    }

    /**
     * 
     * 
     * @private
     * @param {boolean} isTwoFaEnabled
     * 
     * @memberOf ChangeTemporaryPasswordComponent
     */
    private composeOtpValidators(isTwoFaEnabled: boolean) {
        /** Clear otp Validators */
        this.changePassWordForm.controls['otpCode'].clearValidators();
        /**
         * If Two Fa is enabled, make otp code as required
         */
        if (isTwoFaEnabled) {
            this.changePassWordForm.controls['otpCode']
                .setValidators(Validators.compose([
                    Validators.required
                ]));
        }
    }

    /**
     * 
     * 
     * 
     * @memberOf ChangeTemporaryPasswordComponent
     */
    onSubmit() {
        if (this.changePassWordForm.valid) {
            let formValue = {
                eventType: AuthEventType.ChangeTemporaryPassword,
                userName: this.input.userName,
                password: this.input.password,
                newPassword: this.changePassWordForm.value.newPassword,
                twofaenabled: this.canChangeTwoFA ?
                    this.changePassWordForm.value.isTwoFaEnabled : this.input.twoFAEnabled,
                phoneNumber: this.canChangeTwoFA ? this.changePassWordForm.value.phoneNumber : this.input.phoneNumber,
                twofatoken: this.changePassWordForm.value.otpCode,
                rememberme: (this.canChangeTwoFA ?
                    this.changePassWordForm.value.isTwoFaEnabled : this.input.twoFAEnabled)
                    && this.changePassWordForm.value.rememberMe ?
                    this.changePassWordForm.value.rememberMe : this.dataStoreService.hasDeviceId(this.input.userName),
                callBack: (authCallBackEventArgs: AuthCallBackEventArgs) => {
                    if (authCallBackEventArgs.errorCode) {
                        if (authCallBackEventArgs.errorCode === AuthErrorCode.TempPasswordAndNewPasswordCannotBeSame) {
                            this.changePassWordFormErrors.confirmPassword =
                                'Temporary Password and New Password cannot be the same. Please enter a new Password.';
                        }
                        switch (authCallBackEventArgs.errorCode) {
                            case AuthErrorCode.NewPasswordCannotMatchWithTheTemporaryPassword:
                                this.changePassWordFormErrors.confirmPassword = authCallBackEventArgs.authErrorMessage;
                                break;

                            case AuthErrorCode.When2FAIsOptedDeviceHasToBeRegistered:
                                this.changePassWordFormErrors.otpCode = authCallBackEventArgs.authErrorMessage;
                                break;

                            case AuthErrorCode.InvalidToken2FAVerificationFailed:
                                this.changePassWordFormErrors.otpCode =
                                    'Your security token is invalid. Please reenter the token or click on the "Get Code" link' +
                                    ' below to request a new token code.';
                                break;
                        }
                    }
                }
            };
            this.output.emit(formValue);
        } else {
            let newPassword = this.changePassWordForm.controls['newPassword'];
            let invalidError = newPassword.getError('invalidPassword');
            if (invalidError) {
                newPassword.setErrors(null);
                newPassword.setErrors({ 'invalidPassword': ' ' });
            }
            super.validateForm(ChangeTemporaryPasswordResource);
        }
    }

    /**
     * Get the OTP Code
     * 
     * @private
     * @param {string} phoneNumber
     * 
     * @memberOf ChangeTemporaryPasswordComponent
     */
    private getOtpCode(phoneNumber: string) {
        this.changePassWordFormErrors.otpCode = '';
        this.changePassWordFormErrors.phoneNumber = '';

        this.output.emit({
            eventType: AuthEventType.SendVerificationCode,
            phoneNumber: phoneNumber,
            userName: this.input.userName,
            callBack: (authEventArgs: AuthEventArgs) => {
                this.authCallBackEventArgs = authEventArgs;
                if (!this.authCallBackEventArgs.otpSent) {
                    this.changePassWordFormErrors.phoneNumber = this.authCallBackEventArgs.otpError;
                    if (!this.canChangeTwoFA) {
                        /** Show the errors, in the otp text box since we are not showing the phone number textbox here */
                        this.changePassWordFormErrors.otpCode = this.authCallBackEventArgs.otpError;
                    }
                } else {
                    this.changePassWordFormErrors.phoneNumber = '';
                }
            }
        });
    }
    /**
     * 
     * 
     * 
     * @memberOf ChangeTemporaryPasswordComponent
     */
    getCode() {
        if (this.canChangeTwoFA) {
            this.changePassWordFormErrors.phoneNumber = '';
            let isValid = /^\+?[1-9][\d]*$/.test(this.changePassWordForm.value.phoneNumber);
            if (!isValid) {
                this.changePassWordFormErrors.phoneNumber = ChangeTemporaryPasswordResource.phoneNumber.invalidPhoneNumber;
                this.changePassWordForm.value.phoneNumber = '';
            } else {
                this.getOtpCode(this.changePassWordForm.value.phoneNumber);
            }
        } else {
            this.getOtpCode(this.input.phoneNumber);
        }

    }
}

