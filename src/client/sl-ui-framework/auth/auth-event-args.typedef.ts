import { AuthErrorCode } from './auth-item.typedef';

export enum AuthEventType {
    LogIn,
    SendVerificationCode,
    ChangeTemporaryPassword,
    DeviceRegistration,
    GetCustomerContact,
    AcceptAgreement,
    DeclineAgreement
}


export interface AuthEventArgs {
    userName?: string;
    password?: string;
    eventType: AuthEventType;
    phoneNumber?: string;
    newPassword?: string;
    twofaenabled?: boolean;
    twofatoken?: string;
    rememberme?: boolean;
    callBack?: (eventArgs: AuthCallBackEventArgs) => void;
}


export interface AuthCallBackEventArgs {
    otpSent?: boolean;
    twofaenabled?: boolean;
    phoneNumber?: string;
    maskedPhoneNumber?: string;
    otpError?: string;
    errorCode?: AuthErrorCode;
    authErrorMessage?: string;
    consentError?: boolean;
}
