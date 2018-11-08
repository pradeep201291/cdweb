
export enum UploadStatus {
    InProgress = 0,
    Successful = 1,
    Failure = 2
}

export interface FileInfo {
    lastModifiedDate: Date;
    name: string;
    size: number;
    type: string;
    showConditions: boolean;
    uploadStatus: UploadStatus;
    loanNumber: string;
    /**
     * Base64 encoded string
     * 
     * @type {*}
     * @memberOf FileInfo
     */
    content: any;
    is_selected: boolean;
}
