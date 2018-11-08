import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as _ from 'lodash';
import 'rxjs/add/observable/throw';

import { PrivateLabelService } from './../../../../client/app/shared/service/private-label.service';


import { PrivateLblResponse } from './../../../../client/app/shared/service/models/GetPrivateLabelResponse';
import { AuthResource } from '../auth.resource';


import { ErrorMessages, Credentials } from './login.typedef';

import { AuthComponent } from './../auth-component-type.typedef';
import { ComponentLoadArgs } from './../auth-item.typedef';
import { AuthEventArgs, AuthEventType } from './../auth-event-args.typedef';

@Component({
    selector: 'sl-login',
    templateUrl: 'login.component.html'
})

export class LoginComponent extends AuthComponent implements OnInit {

    private stearnsContacttrustedUrl: any;
    private hostName: string;
    private isStearnsContactVisisble: boolean;

    @Input() input: ComponentLoadArgs;
    @Output() output: EventEmitter<AuthEventArgs>;

    private loginForm: FormGroup;

    get thisForm(): FormGroup {
        return this.loginForm;
    }

    loginFormErrors = {
        'userName': '',
        'password': ''
    };

    get formErrors(): any{
        return this.loginFormErrors;
    }

    /**
     * Creates an instance of LoginComponent.
     * 
     * @param {DomSanitizer} sanitizer
     * @param {Router} router
     * @param {ActivatedRoute} activatedRoute
     * @param {PrivateLabelService} lblService
     * @param {FormBuilder} fb
     * 
     * @memberOf LoginComponent
     */
    constructor(private sanitizer: DomSanitizer,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private lblService: PrivateLabelService,
        private fb: FormBuilder) {

        super();

        /*
        ** DomSanitizer is used for bypassing security
        ** AuthenticationService for user validation 
        ** Router for page navigation
        ** LoginAppConstants for application constants
        */
        this.stearnsContacttrustedUrl = sanitizer.bypassSecurityTrustResourceUrl(AuthResource.login.contactURL);
    }

    /**
     * 
     * 
     * @returns
     * 
     * @memberOf LoginComponent
     */
    canLoad() {
        return true;
    }

    /**
     * 
     * 
     * 
     * @memberOf LoginComponent
     */
    ngOnInit() {
        /**
         * @author {karthik}
         * The token value is getting passed from account password reset page for success/failure
         */
        this.lblService.getPrivateLblResponse()
            .subscribe((data: PrivateLblResponse) => {
                this.hostName = this.getLocationUrl();
                this.isStearnsContactVisisble = _.isUndefined(data[this.hostName]);

            });

        if (sessionStorage.getItem(AuthResource.login.currentUser)) {
            this.router.navigate(['/summary']);
        } else {
            this.createForm();
        }
    }


    /**
     * Creates the form.
     * 
     * 
     * @memberOf LoginComponent
     */
    createForm() {
        this.loginForm = this.fb.group({
            userName: [this.input.userName, Validators.required],
            password: [this.input.password, Validators.required]
        });

        if (this.input.authErrorMessage && this.input.authErrorMessage !== '') {
            this.loginFormErrors.password = ErrorMessages[this.input.errorCode].message;
        }
        this.loginForm.valueChanges.subscribe(data => {
            this.onValueChanged(data);
        });
    }



    /**
     * 
     * 
     * @param {Credentials} data
     * 
     * @memberOf LoginComponent
     */
    onValueChanged(data: Credentials) {
        /**
         * Reset the errors.
         */
        this.loginFormErrors.password = '';
        this.loginFormErrors.userName = '';
    }

    /**
     * 
     * Resets the form.
     * 
     * @memberOf LoginComponent
     */
    resetForm() {
        this.loginForm.setValue({
            userName: '',
            password: ''
        });
    }

    /**
     * 
     * 
     * 
     * @memberOf LoginComponent
     */
    onSubmit() {
        if (this.loginForm.valid) {
            this.output.emit({
                eventType: AuthEventType.LogIn,
                userName: this.loginForm.value.userName,
                password: this.loginForm.value.password
            });
        } else {
            /**
             * If the form is not valid, show the error messages.
             */
            super.validateForm(ErrorMessages);
        }
    }

    /**
     * @author {karthik}
     * 
     * @returns {string}
     * 
     * @memberOf LoginComponent
     */
    private getLocationUrl(): string {
        return window.location.hostname;
    }
}

