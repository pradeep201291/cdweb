import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';
import { ChangePasswordResource } from './change-password.resource';
/**
 * 
 * 
 * @export
 * @class FieldValidation
 */
@Injectable()
export class FieldValidation {
    /**
     * 
     * 
     * @private
     * @type {*}
     * @memberOf FieldValidation
     */
    private formErrors: any;
    /**
     * 
     * 
     * @private
     * 
     * @memberOf FieldValidation
     */
    private changePasswordFormError = {
        'oldPassword': '',
        'newPassword': '',
        'confirmPassword': '',
        'otpCode': ''
    };

    /**
     * 
     * 
     * @private
     * @type {*}
     * @memberOf FieldValidation
     */
    private changePwdFormErrors: any;
    /**
     * 
     * 
     * 
     * @memberOf FieldValidation
     */
    set ChangePwdFormErrors(value: any) {
        this.changePwdFormErrors = value;
    }
    /**
     * 
     * 
     * @type {*}
     * @memberOf FieldValidation
     */
    get ChangePwdFormErrors(): any {
        return this.changePwdFormErrors;
    }
    /**
     * Creates an instance of FieldValidation.
     * 
     * 
     * @memberOf FieldValidation
     */
    constructor() {
        this.formErrors = ChangePasswordResource;
        this.ChangePwdFormErrors = this.changePasswordFormError;
    }

    /**
     * 
     * 
     * @returns {ValidatorFn}
     * 
     * @memberOf FieldValidation
     */
    invalidPasswordValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (control.value) {
                const password = control.value;
                let passwordPattern
                    = '^(((?=.*[a-z])(?=.*[A-Z]))((?=.*[a-z])(?=.*[0-9]))((?=.*[A-Z])(?=.*[0-9])))(?=.*[!@#$%^&-*])(?=.{8,})';
                const validPassword = new RegExp(passwordPattern).test(password);
                return validPassword ? null : { 'invalidPassword': { password } };
            }
        };
    }

    /**
     * 
     * 
     * @param {AbstractControl} newPassword
     * @returns {ValidatorFn}
     * 
     * @memberOf FieldValidation
     */
    passwordMatch(newPassword: AbstractControl): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (control.value && newPassword.value) {
                const confirmPasswordValue = control.value;
                const newPasswordValue = newPassword.value;
                //  const newPassword = password.value;
                return confirmPasswordValue === newPasswordValue ? null : { 'passwordDoesntMatch': { confirmPasswordValue } };
            }
        };
    }

    /**
     * 
     * 
     * @param {AbstractControl} newPassword
     * @returns {ValidatorFn}
     * 
     * @memberOf FieldValidation
     */
    passwordDiffer(newPassword: AbstractControl): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (control.value && newPassword.value) {
                const oldPasswordValue = control.value;
                const newPasswordValue = newPassword.value;
                //  const newPassword = password.value;
                return oldPasswordValue !== newPasswordValue ? null : { 'passwordDoesntMatch': { oldPasswordValue } };
            }
        };
    }

    /**
     * 
     * 
     * @param {FormGroup} formGroup
     * 
     * @memberOf FieldValidation
     */
    validateForm(formGroup: FormGroup) {
        for (const obj in this.formErrors) {
            if (this.formErrors.hasOwnProperty(obj)) {
                for (const field in this.formErrors[obj]) {
                    if (this.formErrors[obj].hasOwnProperty(field)) {
                        const control = formGroup.get([obj, field]);
                        if (control && !control.valid) {
                            for (const key in control.errors) {
                                if (control.errors.hasOwnProperty(key)) {
                                    this.ChangePwdFormErrors[field] = this.formErrors[obj][field][key];
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
