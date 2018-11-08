export class LoanInfo {
    src: string;
    loan_num: string;
    prop_address: string;
    prop_city: string;
    prop_state: string;
    prop_zip: string;
    status: string;
}

export interface ContactDO {
    id?: number;
    type?: string;
    name?: string;
    phone?: string;
    email?: string;
    license?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    pic_url?: string;
}

export interface ContactCollection {
    default_item?: string;
    contacts: ContactDO[];
}

export interface ContactData {
    loan_num: string;
    contact_list: ContactCollection;
}

export interface GetContactRequest {
    src: string;
    loan_num: string;
}
