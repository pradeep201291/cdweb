import { AbstractControl, ValidatorFn } from '@angular/forms';


export function invalidPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const password = control.value;
        let passwordPattern
            = '^(((?=.*[a-z])(?=.*[A-Z]))((?=.*[a-z])(?=.*[0-9]))((?=.*[A-Z])(?=.*[0-9])))(?=.*[!@#$%^&-*])(?=.{8,})';
        const validPassword = new RegExp(passwordPattern).test(password);
        return validPassword ? null : { 'invalidPassword': { password } };
    };
}

export function passwordMatch(newPassword: AbstractControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        const confirmPasswordValue = control.value;
        const newPasswordValue = newPassword.value;
        //  const newPassword = password.value;
        return confirmPasswordValue === newPasswordValue ? null : { 'passwordDoesntMatch': { confirmPasswordValue } };

    };
}
