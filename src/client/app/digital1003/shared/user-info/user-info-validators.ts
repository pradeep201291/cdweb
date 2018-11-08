
export function emailValidator(email: string) {
    email = email;
    let emailFormat =
        /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return emailFormat.test(email);
}

export function mobileNumberValidator(mobileNumber: string) {
    mobileNumber = mobileNumber;
    let mobileNumberFormat =
        /^[7-9][0-9]{9}$/;
    return mobileNumberFormat.test(mobileNumber);
}
