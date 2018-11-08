/**
 * 
 * Model class for Change Password Page
 * @export
 * @class ChangePasswordDetail
 */
export class ChangePasswordDetail {
    constructor(
        public oldPassword: string,
        public newPassword: string,
        public confirmPassword: string,
        public TwoFactorToken: string,
        public RememberMe: boolean) {
    }
}


export interface Error {
    Exception?: any;
    ErrorMessage: string;
}

export interface ChangePassword {
    sucess: string;
}

export interface CustomerDetails {
    UserId: string;
    Email: string;
    PhoneNumber: string;
    TwoFactorEnabled: boolean;
}


