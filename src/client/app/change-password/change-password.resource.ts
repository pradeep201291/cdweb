export const ChangePasswordResource = {
    'account': {
        'oldPassword': {
            'required': 'Please enter old Password.',
            'incorrect': 'Invalid Password.'
        },
        'newPassword': {
            'required': 'Please enter the new Password.',
            'invalidPassword': 'Password must contain Lower case, Upper Case, Numeric and Special character with minimum 8 digits.',

            'passwordDoesntMatch': 'New password and Confirm Password does not match. Please retry.'
        },
        'confirmPassword': {
            'required': 'Please enter the confirm password.',
            'passwordDoesntMatch': 'New password and Confirm Password does not match. Please retry.'
        }
    },
    'auth': {
        'otpCode': {
            'required': 'Please enter a valid Code.',
            'invalidToken': 'Invalid Token.',
            'error': 'Problem in sending error code. Please try again.'
        }
    }
};
