import { Injectable } from '@angular/core';
import { LoginComponent } from './login/login.component';

import { ChangeTemporaryPasswordComponent } from './change-temporary-password/change-temporary-password.component';
import { UnknownDeviceComponent } from './unknown-device/unknown-device.component';
import { LicenseAgreementComponent } from './eula/license-agreement.component';

import { ComponentLoadArgs, AuthItem, AuthErrorCode } from './auth-item.typedef';
/**
 * 
 * 
 * @export
 * @class AuthComponentProviderService
 */
@Injectable()
export class AuthComponentProviderService {

    private _authComponents: AuthItem[];

    /**
     * Configures the auth components
     * 
     * @private
     * 
     * @memberOf AuthComponentProviderService
     */
    private ConfigureAuthComponents() {
        this._authComponents = [
            /** Login Component, */
            new AuthItem(
                LoginComponent,
                (componentLoadArgs: ComponentLoadArgs) => {
                    /** Show login component if authentication validator is not defined */
                    return componentLoadArgs && componentLoadArgs.userName === '' && componentLoadArgs.password === ''
                        && (componentLoadArgs.errorCode === AuthErrorCode.invalid_grant ||
                            componentLoadArgs.errorCode === AuthErrorCode.None);

                }
            ),
            new AuthItem(
                ChangeTemporaryPasswordComponent,
                (ComponentLoadArgs: ComponentLoadArgs) => {
                    return ComponentLoadArgs.errorCode === AuthErrorCode.UserNeedsToResetTheTemporaryPassword ||
                        ComponentLoadArgs.errorCode === AuthErrorCode.UserNeedsToResetTheTemporaryPasswordGeneratedByForgetPasswordAction;
                }
            ),
            new AuthItem(UnknownDeviceComponent,
                (ComponentLoadArgs: ComponentLoadArgs) => {
                    return ComponentLoadArgs.errorCode === AuthErrorCode.UnRegisteredDeviceAnd2FAEnabled;
                }),
            new AuthItem(LicenseAgreementComponent,
                (ComponentLoadArgs: ComponentLoadArgs) => {
                    return ComponentLoadArgs.errorCode === AuthErrorCode.ConsentVersionMismatch;
                }),

        ];
    }

    /**
     * Creates an instance of AuthComponentProviderService.
     * 
     * 
     * @memberOf AuthComponentProviderService
     */
    constructor() {
        this.ConfigureAuthComponents();
    }



    /**
     * 
     * 
     * @param {ComponentLoadArgs} componentLoadArgs
     * @returns {AuthItem}
     * 
     * @memberOf AuthComponentProviderService
     */
    getAuthComponent(componentLoadArgs: ComponentLoadArgs): AuthItem {
        return this._authComponents.find(e => e.canLoad(componentLoadArgs));
    }
}

