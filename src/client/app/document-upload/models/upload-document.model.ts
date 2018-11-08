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

