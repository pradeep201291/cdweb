export interface UpdateProfileRequest {
    UserId: string;
    Enable2FA: boolean;
    TwoFactorToken?: string;
    PhoneNumber?: string;
    errorHandler?: (errMessage: string) => void;
}

export enum UpdateEventType {
    ToggleTwoFactor,
    ChangePhoneNumber,
    OTPCode
}

export interface UpdateProfileEventArgs {
    UserId: string;
    TwoFactorEnabled: boolean;
    EventType: UpdateEventType;
    PhoneNumber: string;
    callBack?: (isSuccess: boolean, errMessage?: string) => void;
}


export enum CancelEventType {
    CancelEdit,
    Cancel
}
