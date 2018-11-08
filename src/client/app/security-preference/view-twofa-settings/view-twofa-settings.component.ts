import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CustomerContact } from './../customer-contact.typedef';
import { UpdateProfileEventArgs, UpdateEventType, CancelEventType } from './../update-profile-request.typedef';
const NO_PHONE_NUMBER_MESSAGE = 'No Phone on Record';

@Component({
    selector: 'view-twofa-settings',
    templateUrl: './view-twofa-settings.component.html'
})
export class ViewTwoFaSettingsComponent {
    private _securityPreference: CustomerContact;

    phoneNumber: string;

    hasPhoneNumber: boolean;
    @Input()
    set securityPreference(value: CustomerContact) {
        if (value) {
            this._securityPreference = value;
            if (this.securityPreference && this.securityPreference.PhoneNumber && this.securityPreference.PhoneNumber !== '') {
                this.hasPhoneNumber = true;
                this.phoneNumber = this.securityPreference.PhoneNumber;
            } else {
                this.hasPhoneNumber = false;
                this.phoneNumber = NO_PHONE_NUMBER_MESSAGE;
            }
        }
    }

    get securityPreference(): CustomerContact {
        return this._securityPreference;
    }

    @Output()
    onChange = new EventEmitter<UpdateProfileEventArgs>();

    @Output()
    cancel = new EventEmitter<CancelEventType>();
    /**
     * 
     * 
     * @param {boolean} value
     * 
     * @memberOf ViewTwoFaSettingsComponent
     */
    toggleTwoFASettings(value: boolean) {
        /**
         * Change the preference only if it is different from current settings.
         */
        if (value !== this.securityPreference.TwoFactorEnabled) {
            this.securityPreference.TwoFactorEnabled = value;
            if (this.securityPreference.TwoFactorEnabled) {
                /* If the user has enabled two factor */
                this.editPreferences(false);
            } else {
                this.editPreferences(true);

            }
        }

    }

    /**
     * 
     * 
     * 
     * @memberOf ViewTwoFaSettingsComponent
     */
    editPreferences(isToggleTwoFA?: boolean) {
        this.onChange.emit({
            EventType: isToggleTwoFA ? UpdateEventType.ToggleTwoFactor : UpdateEventType.ChangePhoneNumber,
            PhoneNumber: this.securityPreference.PhoneNumber,
            TwoFactorEnabled: this.securityPreference.TwoFactorEnabled,
            UserId: this.securityPreference.UserId
        });
    }

    onClose() {
        this.cancel.emit(CancelEventType.Cancel);
    }
}
