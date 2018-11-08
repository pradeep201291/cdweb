import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForgotPasswordResource } from './forgot-password.resource';

import { AuthenticationService } from './../auth.service';

const UNKNOWN_USER = 'Sorry, we don’t recognize that User ID.';
const TEMPORARY_PASSWORD_SENT  = 'The temporary password has been emailed to your registered email id.';
/**
 * 
 * 
 * @export
 * @class ForgotPasswordComponent
 */
@Component({
    selector: 'forgot-password',
    templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {

    private forgotPasswordForm: FormGroup;

    private forgotPasswordFormErrors = {
        'userName': ''
    };
    /**
     * Creates an instance of ForgotPasswordComponent.
     * 
     * @param {FormBuilder} fb
     * 
     * @memberOf ForgotPasswordComponent
     */
    constructor(private fb: FormBuilder, private authenticationService: AuthenticationService) {

    }

    /**
     * 
     * 
     * 
     * @memberOf ForgotPasswordComponent
     */
    ngOnInit() {
        this.createForm();
    }

    private createForm() {
        this.forgotPasswordForm = this.fb.group({
            userName: ['', [Validators.required]]
        });
        this.forgotPasswordForm.valueChanges.subscribe(() => {
            this.forgotPasswordFormErrors.userName = '';
        });
    }

    onSubmit() {
        if (this.forgotPasswordForm.valid) {
            this.authenticationService.generatePassword(this.forgotPasswordForm.value.userName)
                .subscribe(response => {
                    this.forgotPasswordFormErrors.userName = TEMPORARY_PASSWORD_SENT;
                }, error => {
                    if (error.errorStatus === 404) {
                        this.forgotPasswordFormErrors.userName = UNKNOWN_USER;
                    } else {
                        this.forgotPasswordFormErrors.userName = error;
                    }
                });
        } else {
            for (const field in this.forgotPasswordFormErrors) {
                if (this.forgotPasswordFormErrors.hasOwnProperty(field)) {
                    this.forgotPasswordFormErrors[field] = '';
                    const control = this.forgotPasswordForm.get(field);
                    if (control && !control.valid) {
                        for (const key in control.errors) {
                            if (control.errors.hasOwnProperty(key)) {
                                if (this.forgotPasswordFormErrors[field] === '') {
                                    this.forgotPasswordFormErrors[field] = ForgotPasswordResource[field][key];
                                }
                            }
                        }

                    }
                }
            }
        }
    }
}
