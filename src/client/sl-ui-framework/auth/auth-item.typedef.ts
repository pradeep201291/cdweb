import { Type } from '@angular/core';
import { AuthComponent } from './auth-component-type.typedef';


export enum AuthErrorCode {
    None = -1,
    invalid_grant = 0,
    TempPasswordAndNewPasswordCannotBeSame = 47,
    PasswordResetNeededAndDeviceMatchedWith2FAEnabled = 48,
    PasswordResetNeededAndDeviceMismatchWithSMS = 49,
    PasswordResetNeededAndDeviceMismatchWith2FAEnabled = 50,
    UserNeedsToResetTheTemporaryPassword = 51,
    CustomerDeviceMismatch = 52,
    InvalidUserType = 53,
    EmpowerException = 54,
    UnhandledException = 55,
    RegistrationExpired = 56,
    RegistrationNotCompleted = 57,
    NewPasswordCannotMatchWithTheTemporaryPassword = 58,
    InvalidToken2FAVerificationFailed = 59,
    PasswordUpdateFailed = 60,
    When2FAIsOptedDeviceHasToBeRegistered = 61,
    UnRegisteredDeviceAnd2FAEnabled = 62,
    UserNeedsToResetTheTemporaryPasswordGeneratedByForgetPasswordAction = 63,
    ConsentVersionMismatch = 65
}

export interface ComponentLoadArgs {
    errorCode?: AuthErrorCode;
    userName: string;
    password: string;
    authErrorMessage?: string;
    sentOtp?: boolean;
    otpError?: string;
    twoFAEnabled?: boolean;
    phoneNumber?: string;
    userDetails?: string;
    rememberMe?: boolean;
    eulaSrc?: string;
}

/**
 * A type for all the Authorization component
 * 
 * @export
 * @interface AuthComponent
 */
export class AuthItem {
    constructor(public component: Type<AuthComponent>, public canLoad: (authValidator?: ComponentLoadArgs) => boolean) {

    }
}

