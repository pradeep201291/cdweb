export interface Need {
    type: string;
    need_id: string;
    comments: string;
    description: string;
    created_date: Date;
    due_date: Date;
    borrower: string;
    status: string;
    action: string;
    action_url: string;
    borrower_id: string;
}
