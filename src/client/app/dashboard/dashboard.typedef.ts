import { ContactInfo } from './contact-summary/contact-summary.typedef';
import { LoanItem } from './loan-summary/loan-summary.typedef';
import { Need } from './needlist/needlist.typedef';
import { Status } from './Status-summary/Status-summary.typedef';

export interface LoanProperty {
    lbl: string;
    val: string;
}

export interface LoanSummary {
    loan_items: LoanProperty[];
}

export interface Status {
    status_text: string;
    current_step: number;
    total_steps: number;
    label: null;
    text: null;
    detail_text: null;
}

export interface ContactList {
    default_item?: string;
    contacts: ContactInfo[];
}

export interface LoanData {
    loan_summary: LoanSummary;
    status: Status;
    notification_count: number;
    message_count: number;
    contact_list: ContactList;
    needs_list: Need[];
}

export interface GetDashboardRequest {
    src: string;
    loan_num: string;
}



export interface DashBoadrViewModel {
    code: number;
    value: Value[];
}

export interface Value {
    loan_summary: LoanItem[];
    status: Status[];
    notification_count: string;
    message_count: string;
    contact_list: ContactData;
    needs_list: Need[];
    loanId: Loan[];
    loan_id: number;
    loan_num: number;
    address: string;
    city: string;
    state: string;
    zip: string;
}

export interface ContactData {
    default_item: ContactInfo;
    contacts: ContactInfo[];
}

export interface Loan {
    loanId: string;
    loanNum: string;
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

export interface GetFormWidgetResponse {
    Body: FormWidgetData;
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
