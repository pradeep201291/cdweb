export enum TaskType {
    eSignTask,
    UploadTask,
    NoPendingTasks
}

export interface Status {
    status_text: string;
    current_step: number;
    total_steps: number;
    label: string;
    text: string;
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

export interface ContactsList {
    default_item?: any;
    contacts: Contact[];
}

export interface NeedsList {
    type: string;
    description: string;
    create_date: Date;
    due_date: Date;
    borrower: string;
    status: string;
    action: string;
    action_url: string;
    need_id: string;
    borrower_id: string;
    comments: string;
}

export interface Summary {
    src: string;
    loan_num: string;
    prop_address: string;
    prop_city: string;
    prop_state: string;
    prop_zip: string;
    status: Status;
    contact_list: ContactsList;
    needs_list: NeedsList[];
}

