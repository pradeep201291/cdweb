export interface LicenseAgreement {
    companyCode: string;
    version: string;
    consent: string;
}


export interface ConsentRequest {
    userName: string;
    version: string;
    date: Date;
}
