import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';

import 'rxjs/add/observable/throw';

import { AuthComponent } from './../auth-component-type.typedef';
import { ComponentLoadArgs } from './../auth-item.typedef';
import { AuthEventArgs, AuthEventType, AuthCallBackEventArgs } from './../auth-event-args.typedef';
import { AuthResource } from './../auth.resource';


declare var $: any;

@Component({
    selector: 'license-agreement',
    templateUrl: 'license-agreement.component.html'
})

export class LicenseAgreementComponent extends AuthComponent implements OnInit {
    @Input() input: ComponentLoadArgs;
    @Output() output: EventEmitter<AuthEventArgs>;

    eulaSrc: SafeResourceUrl;

    get thisForm(): FormGroup {
        return null;
    }

    loginFormErrors = {
    };

    get formErrors(): any {
        return {};
    }

    constructor(private santizer: DomSanitizer) {
        super();
    }

    ngOnInit() {
        this.eulaSrc = this.santizer.bypassSecurityTrustResourceUrl(this.input.eulaSrc)
    }

    /**
     * Accepts the agreement. 
     * 
     * 
     * @memberOf LicenseAgreementComponent
     */
    accept() {
        sessionStorage.setItem(AuthResource.login.currentUser, this.input.userDetails);
        this.output.emit({
            userName: this.input.userName,
            eventType: AuthEventType.AcceptAgreement,
            rememberme: this.input.rememberMe,
            callBack: (callBackEventArgs: AuthCallBackEventArgs) => {
                if (callBackEventArgs && callBackEventArgs.consentError) {
                    this.resetSession();
                }
            }
        });
    }


    private resetSession() {
        sessionStorage.removeItem(AuthResource.login.currentUser);
        if (this.input.rememberMe) {
            localStorage.removeItem(AuthResource.login.device_ID);
        }
    }

    /**
     * Decline the agreement
     * 
     * 
     * @memberOf LicenseAgreementComponent
     */
    decline() {
        $('#session-expire-eula').modal('show');
    }

    continue() {
        $('#session-expire-eula').modal('hide');
        this.resetSession();
        this.output.emit({
            userName: this.input.userName,
            eventType: AuthEventType.DeclineAgreement,
        });
    }

    redirectToEula() {
       $('#session-expire-eula').modal('hide');
    }


}
