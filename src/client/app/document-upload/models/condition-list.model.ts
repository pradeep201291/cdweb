export interface Condition {
    additional_comments: string;
    cond_comments: string;
    cond_desc: string;
    cond_id: string;
    date_added: string;
    responsible_party: string;
    status: string;
    type_id: string;
    is_selected: boolean;
}

export interface GetNeedListRequest {
    src: string;
    loan_num: string;
}


export interface UploadAction {
    type: string;
    need_id: string;
    description: string;
    comments: string;
    create_date: Date;
    due_date: Date;
    borrower: string;
    borrower_id: string;
    status: string;
    action: string;
    action_url: string;
}
export interface LoanData {
    needs_list: UploadAction[];
}
