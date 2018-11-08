/**
 * 
 * 
 * @export
 * @interface Datum
 */
export interface Document {
    document_id: string;
    document_name: string;
    document_type: string;
    category: string;
    last_update_datetime: Date;
    last_update_username: string;
    document_size: number;
}

/**
 * 
 * 
 * @export
 * @interface DocumentData
 */
export interface DocumentData {
    document_id: string;
    document_name: string;
    document_type: string;
    category: string;
    last_update_datetime: Date;
    last_update_username: string;
    document_size: number;
    image: string;
}

/**
 * 
 * 
 * @export
 * @interface Loan
 */
export interface Loan {
    loan_num: string;
    src: string;
}


/**
 * 
 * 
 * @export
 * @interface UploadDocumentModel
 */
export interface UploadDocumentModel {
    file_name: string;
    loan_num: string;
    need_ids: number[];
    type: string;
    document_name: string;
    image: string;
}


export interface UploadDocumentResponse {
    document_name: string;
    document_id: string;
    upload_status: string;
}




