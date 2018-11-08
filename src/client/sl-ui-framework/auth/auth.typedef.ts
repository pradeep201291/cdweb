export interface GetLoginRequest {
    grant_type: string;
    username: string;
    password: string;
    newpassword?: string;
    phonenumber?: string;
    twofaenabled?: boolean;
    twofatoken?: string;
    rememberme?: boolean;
    eulaVersion?: string;
}

export interface GetLogoutRequest {
    UserId: string;
}


export interface GetLoginResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    UserName: string;
    UserType: string;
    issued: string;
    expires: string;
    eulaError?: string;
}

/**
 * @author {Pradeep}
 * 
 * @export
 * @interface EnterUserID
 */
export class EnterUserID {
    /**
     * Creates an instance of EnterUserID.
     * 
     * @param {string} userID
     * 
     * @memberOf EnterUserID
     */
    constructor(public userID: string) {
    }
}

/**
 * @author {Pradeep}
 * 
 * @export
 * @interface ResetPasswordDetail
 */
export class ResetPasswordDetail {
    /**
     * Creates an instance of ResetPasswordDetail.
     * 
     * @param {string} authCode
     * @param {string} newPassword
     * @param {string} confirmPassword
     * 
     * @memberOf ResetPasswordDetail
     */
    constructor(
        public authCode: string,
        public newPassword: string,
        public confirmPassword: string,
        public oldPassword: string) {
    }
}

export class PayLoadData {
    unique_name: string;
    email: string;
    FirstName: number;
    LastName: string;
}

export class User {
    constructor(public email: string, public password: string) {
    }
}

export enum AuthFlowType {
    Login = 0,
    ResetPassword,
    userReg,
    DeviceReg,
    TwoFactorAuth
}

export interface AuthFlow {
    form: AuthFlowType;
}

export interface UserName {
    userName: string;
}

export interface UserResponse {
    UserId: string;
    Email: string;
    PhoneNumber: string;
    TwoFactorEnabled: boolean;
}

export enum PasswordStrength {
    TooShort = 1,
    VeryWeak,
    Weak,
    Medium,
    Strong
}

/**
 * 
 * 
 * @export
 * @class JWTHelper
 */
export class JWTHelper {
    /**
     * 
     * 
     * @private
     * @param {string} str
     * @returns
     * 
     * @memberOf JWTHelper
     */
    private urlBase64Decode(str: string) {
        let output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0: break;
            case 2: output += '=='; break;
            case 3: output += '='; break;
            default: throw 'Illegal base64url string!';
        }
        return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
        let code = p.charCodeAt(0).toString(16).toUpperCase();
        if (code.length < 2) {
          code = '0' + code;
        }
        return '%' + code;
      }));
    }

    /**
     * 
     * 
     * @param {string} token
     * @returns
     * 
     * @memberOf JWTHelper
     */
    public decodeToken(token: string) {
        let parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }
        let decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            throw new Error('Cannot decode the token');
        }
        return JSON.parse(decoded);
    }
}
