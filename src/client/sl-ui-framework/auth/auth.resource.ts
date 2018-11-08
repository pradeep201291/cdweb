export const AuthResource = {
    login: {
        currentUser: 'current_borrower',
        contactURL: 'https://stearns.com/contact/#large-find-branch-widget',
        defaultError: 'The username or password you entered is incorrect.',
        defaultDomain: 'stearns.com',
        resetStatusCode: '51',
        currentUsername: 'current_username',
        device_ID: 'devices'
    },
    error: {
        TempPasswordAndNewPasswordCannotBeSame: '47',
        PasswordResetNeededAndDeviceMatchedWith2FAEnabled: '48',
        PasswordResetNeededAndDeviceMismatchWithSMS: '49',
        PasswordResetNeededAndDeviceMismatchWith2FAEnabled: '50',
        PasswordResetNeeded: '51',
        CustomerDeviceMismatch: '52',
        InvalidUserType: '53',
        InvalidGrant: 'invalid_grant',
        InvalidClient: 'invalid_client',
        EmpowerException: '54',
        UnhandledException: '55',
        RegistrationExpired: '56',
        RegistrationNotCompleted: '57',
        MissingParameters: '58',
        InvalidToken: '59',
        PasswordUpdateFailed: '60',
        InvalidDataCombination: '61',
        UnRegisteredDeviceAnd2FAEnabled: '62',
        ForgotPassword: '63'
    },
    req_param: {
        login: {
            grant_type: 'grant_type',
            username: 'username',
            password: 'password',
            newpassword: 'newpassword',
            twofaenabled: 'twofaenabled',
            twofatoken: 'twofatoken',
            rememberme: 'rememberme',
            phonenumber: 'phonenumber',
            eulaVersion: 'eulaVersion'
        }
    },
    response_param: {
        login: {
            access_token: 'access_token',
            token_type: 'token_type',
            expires_in: 'expires_in',
            refresh_token: 'refresh_token',
            userName: 'UserName',
            userType: 'UserType',
            issued: '.issued',
            expires: '.expires',
            eulaError: '65'
        }
    }

};
