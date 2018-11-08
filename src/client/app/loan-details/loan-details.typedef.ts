export interface Borrower {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    user_id: string;
    app_number: string;
    housenum: string;
    address: string;
    city: string;
    state: string;
    zip: string;
}

export interface Loan {
    loan_num: string;
    rate: string;
    lock_date: string;
    lock_exp_date: string;
    purchase_price: string;
    appraised_value: string;
    note_loan_amt: string;
    ltv: string;
    payment: string;
    discl_sent_date: string;
    closing_discl_date: string;
    clear_to_close_date: string;
    amort_type: string;
    apr: string;
    lock_period: string;
    first_pay_date: string;
    clear_to_close_status: string;
    appr_recv_date: string;
    escrow_payment?: any;
    borrower: string;
    borrower_address: string;
    borrower_phone: string;
    borrower_email: string;
    coborrower: string;
    loan_term: string;
    loan_purpose: string;
    final_approval_date: string;
    amort_type_desc: string;
    loan_type_desc: string;
    p_and_i_payment: string;
    mi: string;
    appraisal_date: string;
    borrowers: Borrower[];
}

export interface LoanData {
    loan: Loan;
}

export interface GetLoanDetailRequest {
    src: string;
    loan_num: string;
}
