import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../sl-ui-framework/auth/auth.service';
import { CustomerContact } from './customer-contact.typedef';

import { ProfileService } from './profile.service';

import { UpdateProfileEventArgs, UpdateProfileRequest, CancelEventType } from './update-profile-request.typedef';
import { DataStoreService } from './../../sl-ui-framework/infrastructure/data-store/data-store.service';
@Component({
    selector: 'sl-securityPreference',
    templateUrl: './security-preference.component.html',
})
export class SecurityPreference implements OnInit {

    securityPreference: CustomerContact;
    updateProfileEventArgs: UpdateProfileEventArgs;
    isEditable: boolean;
    constructor(private router: Router,
        private authenticationService: AuthenticationService,
        private profileService: ProfileService,
        private dataStoreService: DataStoreService
    ) { }

    /**
     * 
     * 
     * 
     * @memberOf SecurityPreference
     */
    ngOnInit() {
        this.isEditable = false;
        this.getCustomerContact();
    }


    private getCustomerContact() {
        this.securityPreference = null;
        this.authenticationService.getCustomerContact(this.dataStoreService.getUserFromSession().UserId)
            .subscribe(response => {
                this.securityPreference = response;
            });
    }

    editPreferences(eventArgs: UpdateProfileEventArgs) {
        this.updateProfileEventArgs = eventArgs;
        this.isEditable = true;
    }

    /**
     * 
     * 
     * @param {UpdateProfileEventArgs} eventArgs
     * 
     * @memberOf SecurityPreference
     */
    getOtpCode(eventArgs: UpdateProfileEventArgs) {
        this.authenticationService.sendOTP(eventArgs.UserId, eventArgs.PhoneNumber)
            .subscribe(res => eventArgs.callBack(true), err => {
                let message = err.Message;
                eventArgs.callBack(false, message);
            });
    }


    saveProfile(eventArgs: UpdateProfileRequest) {
        console.log(eventArgs);
        this.profileService.updateProfile(eventArgs)
            .subscribe(res => {
                this.isEditable = false;
                this.getCustomerContact();
            }, err => {
                if (eventArgs.errorHandler) {
                    let errorMessage = 'Unknown error.';
                    if (err && err.Message) {
                        errorMessage = err.Message;
                    }
                    eventArgs.errorHandler(errorMessage);
                }
            });
    }

    cancel(eventType: CancelEventType) {
        if (eventType === CancelEventType.CancelEdit) {
            this.isEditable = false;
            this.getCustomerContact();
        } else {
            this.router.navigate(['/summary']);
        }
    }

}

