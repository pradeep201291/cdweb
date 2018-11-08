export enum TaskType {
    eSignTask,
    UploadTask,
    NoPendingTasks,
    assetsCheckTask
}

export interface Contact {
    id: number;
    type: string;
    name: string;
    phone: string;
    email: string;
    license: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    pic_url: string;
}


export interface Loan {
    address: string;
    closingDate: Date;
    status: string;
    loan_num: string;
    contact: Contact;
    labelKey: string;
    labelValue: string;
}
export interface TaskInfo {
    type: TaskType;
    isActive: boolean;
    actionUrl: string;
    loan: Loan;
    need_id: string;
    borrower_id: string;
    status: string;
    description: string;
    comments: string;
    borrower: string;
}
export interface GetFormWidgetRequest {
    LoanNumber: string;
    BorrowerIndex: string;
    VOD_ID: string;
    maxWidth: string;
    maxHeight: string;
}
export interface FormWidgetData {
    GetEnrollmentWidgetResult: boolean;
    widget: string;
    errorMessage: string;
}

export interface GetDocutechSsoRequest {
    BorrId: string;
    BorrFullName: string;
    BorrDTUrl: string;
    LoanNumber: string;
}


export interface GetDocutechSsoResponse {
    token_type: string;
    Bearer: string;
    expires_in: string;
    access_token: string;
}
