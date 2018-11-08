
import { Component } from '@angular/core';
import { CustomerDetails } from './change-password.model';
import { ChangePasswordService } from './change-password.service';
import { AuthenticationService } from './../../sl-ui-framework/auth/auth.service';
import { Router } from '@angular/router';
import 'rxjs/add/observable/throw';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangePasswordResource } from './change-password.resource';

import { FieldValidation } from './field-validation.service';
import { DataStoreService } from './../../sl-ui-framework/infrastructure/data-store/data-store.service';
import * as _ from 'lodash';
/**form group types */
enum GroupType {
    account = 0,
    auth,
    device
}

@Component({
    selector: 'change-password',
    templateUrl: './change-password.page.html',
    providers: [ChangePasswordService, FieldValidation]

})
export class ChangePasswordPage {
    private changePwdForm: FormGroup;
    customerData: CustomerDetails;
    private isDeviceRegistered: boolean = false;
    private changePwdFormErrors: any;
    showDoneBtn: boolean;
    showCancelBtn: boolean;
    constructor(private fb: FormBuilder,
        private router: Router,
        private changePasswordService: ChangePasswordService,
        private authenticationService: AuthenticationService,
        private fieldValidation: FieldValidation,
        private dataStoreService: DataStoreService) {
        /**caller for creating form group */
        this.createFormGroup();
        /**Am empty error definitions are picked from service */
        this.changePwdFormErrors = this.fieldValidation.ChangePwdFormErrors;
    }

    /**
     *  
     * 
     * 
     * @memberOf ChangePasswordPage
     */
    ngAfterViewInit() {
        /**caller for getting CustomerDetails */
        this.getCustomerContact();
        /**listener for form value changes */
        this.onValueChange();
    }

    /**
     * @desc object frame for form group
     * {account} is a group consist of old,new and confirm password
     * {auth} is a group for 2fa section
     * {device} is a group for device identity register
     * 
     * @memberOf ChangePasswordPage
     */
    createFormGroup() {
        this.changePwdForm = this.fb.group({
            account: this.fb.group({
                oldPassword: ['', Validators.required],
                newPassword: [''],
                confirmPassword: [''],
            }),
            auth: this.fb.group({
                phoneNumber: ['', Validators.required],
                otpCode: ['', Validators.required],
                isOTPSent: [true],
            }),
            device: this.fb.group({
                rememberMe: [false, [Validators.nullValidator]]
            }),
        });
        /**validators to compare new and confirm password */
        let newPassword = this.changePwdForm.get(['account', 'newPassword']);
        this.changePwdForm.get(['account', 'confirmPassword'])
            .setValidators(Validators.compose([
                Validators.required,
                this.fieldValidation.passwordMatch(newPassword)
            ]));
        let confirmPassword = this.changePwdForm.get(['account', 'confirmPassword']);
        this.changePwdForm.get(['account', 'newPassword'])
            .setValidators(Validators.compose([
                Validators.required,
                Validators.minLength(8),
                this.fieldValidation.invalidPasswordValidator(),
                this.fieldValidation.passwordMatch(confirmPassword)
            ]));
    }

    /**
     * @desc remove control from form for a given group type 
     * 
     * @param {GroupType} controlType
     * 
     * @memberOf ChangePasswordPage
     */
    removeControl(controlType: GroupType) {
        if (this.changePwdForm.contains(GroupType[controlType])) {
            this.changePwdForm.removeControl(GroupType[controlType]);
        }
    }

    /**
     * @desc listener for form value changes
     * 
     * 
     * @memberOf ChangePasswordPage
     */
    onValueChange() {
        /**subscriptions for account group value changes */
        this.changePwdForm.controls[GroupType[GroupType.account]].valueChanges.subscribe((value: any) => {
            /**hide required  error for valid old password */
            if (value.oldPassword) {
                this.changePwdFormErrors.oldPassword = '';
            }
            /**hide required  error for valid new password */
            if (value.newPassword) {
                this.changePwdFormErrors.newPassword = '';
            }
            /**hide required  error for valid confirm password */
            if (value.confirmPassword) {
                this.changePwdFormErrors.confirmPassword = '';
            }
            if (value.newPassword && value.confirmPassword && value.newPassword !== '' && value.confirmPassword !== ''
                && value.newPassword === value.confirmPassword) {
                let invalidError = this.changePwdForm.get(['account', 'newPassword']).getError('invalidPassword');
                let newMatchError = this.changePwdForm.get(['account', 'newPassword']).getError('passwordDoesntMatch');
                let confirmMatchError = this.changePwdForm.get(['account', 'confirmPassword']).getError('passwordDoesntMatch');
                this.changePwdFormErrors.confirmPassword = '';
                this.changePwdFormErrors.newPassword = '';
                if (!invalidError && _.isUndefined(invalidError)) {
                    this.changePwdForm.get(['account', 'newPassword']).setErrors(null);
                    this.changePwdForm.get(['account', 'confirmPassword']).setErrors(null);
                }
                if ((newMatchError && !_.isUndefined(newMatchError)) && (confirmMatchError && !_.isUndefined(confirmMatchError))) {
                    this.changePwdForm.get(['account', 'confirmPassword']).setErrors(null);
                }

            }
        });
        /**subscriptions for auth group value changes */
        if (this.changePwdForm.contains(GroupType[GroupType.auth])) {
            this.changePwdForm.controls[GroupType[GroupType.auth]].valueChanges.subscribe((value: any) => {
                /**hide required  error for valid otp code */
                if (value.otpCode) {
                    this.changePwdFormErrors.otpCode = '';
                }
            });
        }

    }

    /**
     * @desc subscriber for get CustomerDetails
     * 
     * 
     * @memberOf ChangePasswordPage
     */
    getCustomerContact() {
        let authControl = this.changePwdForm.controls[GroupType[GroupType.auth]];
        let loggedInUser = this.dataStoreService.getUserFromSession();
        this.changePasswordService.getCustomerContact(loggedInUser.UserId)
            .subscribe((response) => {
                this.customerData = response;
                authControl.patchValue({ phoneNumber: response.PhoneNumber });
                if (this.customerData && this.customerData.TwoFactorEnabled) {
                    if (this.dataStoreService.hasDeviceId()) {
                        /** Device is already registered. */
                        this.isDeviceRegistered = true;
                        /**remove auth group from form */
                        this.removeControl(GroupType.device);
                    }
                    this.changePasswordService.sendOTP(loggedInUser.UserId, this.customerData.PhoneNumber)
                        .subscribe((result) => {
                            let hasResponse = (result !== null);
                            authControl.patchValue({ isOTPSent: hasResponse });
                        }, error => {
                            let isErr = (error !== null);
                            authControl.patchValue({ isOTPSent: !isErr });
                        });
                } else {
                    this.removeControl(GroupType.auth);
                    this.removeControl(GroupType.device);
                }
            }, error => {
                authControl.patchValue({ phoneNumber: '-' });
            });
    }

    /**
     * @desc subscriber for sending otp code
     * 
     * 
     * @memberOf ChangePasswordPage
     */
    sendOTPCode() {
        let authControl = this.changePwdForm.controls[GroupType[GroupType.auth]];
        let loggedInUser = this.dataStoreService.getUserFromSession();
        this.changePasswordService.sendOTP(loggedInUser.UserId, this.customerData.PhoneNumber)
            .subscribe((result) => {
                let hasResponse = (result !== null);
                authControl.patchValue({ isOTPSent: hasResponse });
            }, error => {
                let isErr = (error !== null);
                authControl.patchValue({ isOTPSent: !isErr });
            });
    }

    /**
     * @desc route to summary page
     * 
     * 
     * @memberOf ChangePasswordPage
     */
    onCancel() {
        this.router.navigate(['/summary']);
    }

    /**
     * @desc form submit
     * 
     * 
     * @memberOf ChangePasswordPage
     */
    onSubmit() {
        if (this.changePwdForm.valid) {
            let loggedInUser = this.dataStoreService.getUserFromSession();
            let formData = this.changePwdForm.value || this.changePwdForm.value.json();
            let payLoad = {
                oldPassword: formData.account.oldPassword,
                newPassword: formData.account.newPassword,
                confirmPassword: formData.account.confirmPassword,
                TwoFactorToken: this.customerData && this.customerData.TwoFactorEnabled ? formData.auth.otpCode : '',
                RememberMe: formData.device && formData.device.rememberMe && !_.isUndefined(formData.device.rememberMe) ?
                    formData.device.rememberMe : this.dataStoreService.hasDeviceId(loggedInUser.UserId)
            };
            this.changePasswordService.getChangePasswordDetails(payLoad, loggedInUser.UserId)
                .subscribe((result) => {
                    this.showDoneBtn = (result !== null);
                    if (!this.dataStoreService.hasDeviceId() && payLoad.RememberMe) {
                        this.dataStoreService.setDeviceId();
                    }
                }, error => {
                    /**
                     * @todo discuss with API team to share a proper error object.
                     */
                    if (error && error.Message) {
                        if (error && error.Message === '{"Message":"An error has occurred."}') {
                            this.changePwdFormErrors.otpCode = error.Message;

                        } else {
                            this.changePwdFormErrors.confirmPassword = error.Message;
                        }
                    } else {
                        // this.showCancelBtn = (error !== null);
                        this.changePwdFormErrors.oldPassword = ChangePasswordResource.account.oldPassword.incorrect;
                    }
                });
        } else {
            let invalidError = this.changePwdForm.get(['account', 'newPassword']).getError('invalidPassword');
            if (invalidError && !_.isUndefined(invalidError)) {
                this.changePwdForm.get(['account', 'newPassword']).setErrors(null);
                this.changePwdForm.get(['account', 'newPassword']).setErrors({ 'invalidPassword': ' ' });
            }
            this.fieldValidation.validateForm(this.changePwdForm);
            this.changePwdFormErrors = this.fieldValidation.ChangePwdFormErrors;
            console.log(this.changePwdFormErrors);
        }
    }
}










