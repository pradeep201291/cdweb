import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UpdateProfileEventArgs, UpdateEventType, UpdateProfileRequest, CancelEventType } from './../update-profile-request.typedef';


const NO_PHONE_NUMBER_MESSAGE = 'No Phone on Record.';
const INVALID_PHONE_NUMBER_ERR = 'Please enter a valid Phone Number.';
const OTP_ERROR = 'Please enter a valid Code.';

@Component({
    selector: 'edit-twofa-settings',
    templateUrl: 'edit-twofa-settings.component.html'
})
export class EditTwoFASettingsComponent implements OnInit {
    @Input()
    updateProfileEventArgs: UpdateProfileEventArgs;

    updateProfileForm: FormGroup;

    errorMessage: string;

    phoneNumber: string;

    hasPhoneNumber: boolean;

    phoneNumberError: string;
    otpError: string;
    @Output()
    getOtpCode = new EventEmitter<UpdateProfileEventArgs>();

    @Output()
    saveProfile = new EventEmitter<UpdateProfileRequest>();
    get canSubmit(): boolean {
        return this.updateProfileEventArgs.TwoFactorEnabled === false ||
            this.updateProfileEventArgs.EventType === UpdateEventType.OTPCode;
    }

    @Output()
    cancel = new EventEmitter<CancelEventType>();

    get isOTPSent(): boolean {
        return this.updateProfileEventArgs.EventType === UpdateEventType.OTPCode;
    }
    constructor(private fb: FormBuilder) {

    }

    /**
     * 
     * 
     * @readonly
     * @type {boolean}
     * @memberOf EditTwoFASettingsComponent
     */
    get canChangePhoneNumber(): boolean {
        /** The phone number can be changed */
        /**
         * If the user has invalid phone number and opted for two factor
         */
        return this.updateProfileEventArgs.EventType === UpdateEventType.ChangePhoneNumber;
    }

    get canClose(): boolean {
        return this.updateProfileEventArgs.EventType === UpdateEventType.ToggleTwoFactor;
    }

    /**
     * 
     * 
     * @readonly
     * @type {boolean}
     * @memberOf EditTwoFASettingsComponent
     */
    get canEditPhoneNumber(): boolean {
        return this.updateProfileEventArgs.TwoFactorEnabled &&
            this.IsValidPhoneNumber && this.updateProfileEventArgs.EventType !== UpdateEventType.OTPCode;
    }

    /**
     * 
     * 
     * @readonly
     * @type {boolean}
     * @memberOf EditTwoFASettingsComponent
     */
    get canShowPhoneNumber(): boolean {
        return this.updateProfileEventArgs.EventType === UpdateEventType.ToggleTwoFactor;
    }

    private get IsValidPhoneNumber() {
        return (this.updateProfileEventArgs.PhoneNumber !== null && this.updateProfileEventArgs.PhoneNumber !== '');
    }

    ngOnInit() {
        this.createForm();
        this.phoneNumberError = '';
        this.otpError = '';
        if (this.updateProfileEventArgs && this.updateProfileEventArgs.PhoneNumber && this.updateProfileEventArgs.PhoneNumber !== '') {
            this.hasPhoneNumber = true;
            this.phoneNumber = this.updateProfileEventArgs.PhoneNumber;
        } else {
            this.hasPhoneNumber = false;
            this.phoneNumber = NO_PHONE_NUMBER_MESSAGE;
            this.updateProfileEventArgs.EventType = UpdateEventType.ChangePhoneNumber;
        }
    }

    private resetErrors() {
        this.errorMessage = '';
        this.otpError = '';
        this.phoneNumberError = '';
    }

    private createForm() {
        this.updateProfileForm = this.fb.group({
            'twoFactorEnabled': [this.updateProfileEventArgs.TwoFactorEnabled, Validators.required],
            'phoneNumber': [this.updateProfileEventArgs.PhoneNumber],
            'otpCode': ['']
        });

        this.updateProfileForm.valueChanges.subscribe(data => {
            this.resetErrors();
            this.updateProfileForm.controls['otpCode'].clearValidators();
            if (data.twoFactorEnabled) {
                this.updateProfileForm.controls['otpCode'].setValidators(Validators.compose([
                    Validators.required
                ]));
            }
        });

    }


    editPhoneNumber() {
        this.updateProfileEventArgs.EventType = UpdateEventType.ChangePhoneNumber;
    }

    toggleTwoFASettings(isTwoFactorEnabled: boolean) {
        this.updateProfileEventArgs.TwoFactorEnabled = isTwoFactorEnabled;
        if (!isTwoFactorEnabled) {
            this.updateProfileEventArgs.EventType = UpdateEventType.ToggleTwoFactor;
        } else {
            if (!this.IsValidPhoneNumber) {
                this.updateProfileEventArgs.EventType = UpdateEventType.ChangePhoneNumber;
            }
        }

    }

    onSubmit() {
        console.log(this.updateProfileForm.valid);
        if (this.updateProfileForm.valid) {
            let updateProfileEventArgs: UpdateProfileRequest;
            if (this.updateProfileEventArgs.TwoFactorEnabled) {
                updateProfileEventArgs = {
                    Enable2FA: true,
                    PhoneNumber: this.updateProfileForm.controls['phoneNumber'].value,
                    TwoFactorToken: this.updateProfileForm.controls['otpCode'].value,
                    UserId: this.updateProfileEventArgs.UserId
                };
            } else {
                updateProfileEventArgs = {
                    Enable2FA: false,
                    UserId: this.updateProfileEventArgs.UserId,
                    PhoneNumber: this.updateProfileForm.controls['phoneNumber'].value,
                };
            }
            updateProfileEventArgs.errorHandler = (errorMsg: string) => {
                this.errorMessage = errorMsg;
            };
            this.saveProfile.emit(updateProfileEventArgs);
        } else {
            if (!this.updateProfileForm.controls['otpCode'].valid) {
                this.otpError = OTP_ERROR;
            }
        }
    }

    getCode() {
        let self = this;
        this.phoneNumberError = '';
        let isValid = /^\+?[1-9][\d]*$/.test(this.updateProfileForm.value.phoneNumber);
        self.updateProfileEventArgs.EventType = UpdateEventType.ChangePhoneNumber;
        if (!isValid) {
            this.phoneNumberError = INVALID_PHONE_NUMBER_ERR;
        } else {
            this.getOtpCode.emit({
                callBack: (isSuccess: boolean, errMssg: string) => {

                    if (isSuccess) {
                        self.phoneNumberError = '';
                        self.updateProfileEventArgs.EventType = UpdateEventType.OTPCode;
                    } else if (errMssg && errMssg.toLowerCase().includes('email / phone number registration failed.')) {
                        self.updateProfileEventArgs.EventType = UpdateEventType.ChangePhoneNumber;
                        self.phoneNumberError = INVALID_PHONE_NUMBER_ERR;
                    } else {
                        self.updateProfileEventArgs.EventType = UpdateEventType.ChangePhoneNumber;
                        self.phoneNumberError = 'Unknown error while sending the OTP Code';
                    }
                },
                EventType: UpdateEventType.OTPCode,
                PhoneNumber: this.updateProfileForm.value.phoneNumber,
                TwoFactorEnabled: this.updateProfileEventArgs.TwoFactorEnabled,
                UserId: this.updateProfileEventArgs.UserId
            });
        }
    }

    onCancel() {
        this.cancel.emit(CancelEventType.CancelEdit);
    }

    onClose() {
        this.cancel.emit(CancelEventType.Cancel);
    }
}
