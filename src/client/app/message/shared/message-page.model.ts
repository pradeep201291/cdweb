
export interface Unread {
    unread_count: number;
}

/**
 * 
 * 
 * @export
 * @interface UnreadCount
 */
export interface MessageUnreadCount {
    total_unread_count: number;
}

/**
 * 
 * @author {karthik}
 * @export
 * @interface Contact
 */
export interface Contact {
    /**
     * 
     * 
     * @type {string}
     * @memberOf Contact
     */
    role?: string;
    /**
     * 
     * 
     * @type {string}
     * @memberOf Contact
     */
    name?: string;
    unread_count?: number;
    is_selected: boolean;
    pic_url: string;

}

/**
 * 
 * @author {karthik}
 * @export
 * @interface Message
 */
export interface Message {
    /**
     * 
     * @author {karthik}
     * @type {number}
     * @memberOf Message
     */
    message_id?: number;
    /**
     * 
     * 
     * @type {string}
     * @memberOf Message
     */
    message_text?: string;
    /**
     * 
     * 
     * @type {string}
     * @memberOf Message
     */
    from_name?: string;
    /**
     * 
     * 
     * @type {string}
     * @memberOf Message
     */
    to_name?: string;
    /**
     * 
     * 
     * @type {Date}
     * @memberOf Message
     */
    date_sent?: Date;
    /**
     * 
     * 
     * @type {boolean}
     * @memberOf Message
     */
    sent?: boolean;
    /**
     * 
     * 
     * @type {number}
     * @memberOf Message
     */
    status?: number;
    /**
     * 
     * 
     * @type {number}
     * @memberOf Message
     */
    pic_url: string;
}

/**
 * 
 * @author {karthik}
 * @export
 * @interface Data
 */
export interface GetMessageResponse {
    /**
     * 
     * 
     * @type {Contact[]}
     * @memberOf Data
     */
    contacts: Contact[];
    /**
     * 
     * 
     * @type {Message[]}
     * @memberOf Data
     */
    messages: Message[];
}

/**
 * 

/**
 * 
 * @author {karthik}
 * @export
 * @interface MessageRequest
 */
export interface MessageRequest {
    /**
     * 
     * 
     * @type {string}
     * @memberOf MessageRequest
     */
    src: string;
    /**
     * 
     * 
     * @type {string}
     * @memberOf MessageRequest
     */
    loan_num: string;
}

/**
 * 
 * @author {karthik}
 * @export
 * @interface LoanOfficer
 */
export interface LoanOfficer {
    /**
     * 
     * 
     * @type {string}
     * @memberOf LoanOfficer
     */
    name?: string;
    /**
     * 
     * 
     * @type {string}
     * @memberOf LoanOfficer
     */
    designation?: string;
    /**
     * 
     * 
     * @type {string}
     * @memberOf LoanOfficer
     */
    profile_pic?: string;
}

/**
 * 
 * @author {karthik}
 * @export
 * @interface MessageGroupItemList
 */
export interface MessageGroupItemList {
    /**
     * 
     * 
     * @type {string}
     * @memberOf MessageGroupItemList
     */
    name?: string;
    /**
     * 
     * 
     * @type {string}
     * @memberOf MessageGroupItemList
     */
    role?: string;
    /**
     * 
     * 
     * @type {string}
     * @memberOf MessageGroupItemList
     */
    profile_pic?: string;
    /**
     * 
     * 
     * @type {string}
     * @memberOf MessageGroupItemList
     */
    loan_num?: string;
    /**
     * 
     * 
     * @type {Message[]}
     * @memberOf MessageGroupItemList
     */
    message?: Message[];
    /**
     * 
     * 
     * @type {number}
     * @memberOf MessageGroupItemList
     */
    unread_count?: number;
}

/**
 * 
 * @author {karthik}
 * @export
 * @enum {number}
 */
export enum MessageAction {
    /**
     * 
     */
    userTextInput = 0,
    /**
     * 
     */
    serverResponse
}

/**
 * 
 * @author {karthik}
 * @export
 * @enum {number}
 */
export enum MessageState {
    /**
     * 
     */
    New = 1,
    /**
     * 
     */
    Read
}

/**
 * 
 * @author {karthik}
 * @export
 * @enum {number}
 */
export enum SortOrder {
    /**
     * 
     */
    desc,
    /**
     * 
     */
    asc
}

/**
 * 
 * @author {karthik}
 * @export
 * @interface MessageStore
 */
export interface MessageStore {
    /**
     * 
     * 
     * @type {MessageAction}
     * @memberOf MessageStore
     */
    type: MessageAction;
    /**
     * 
     * 
     * @type {Message[]}
     * @memberOf MessageStore
     */
    message: Message[];
}

/**
 * 
 * @author {karthik}
 * @export
 * @interface ResponseStatus
 */
export interface ResponseStatus {
    /**
     * 
     * 
     * @type {string}
     * @memberOf ResponseStatus
     */
    status: string;
}

/**
 * 
 * @author {karthik}
 * @export
 * @interface ReceiverInfo
 */
export interface ReceiverInfo {
    /**
     * 
     * 
     * @type {string}
     * @memberOf ReceiverInfo
     */
    role?: string;
    /**
     * 
     * 
     * @type {string}
     * @memberOf ReceiverInfo
     */
    name?: string;
}

/**
 * 
 * @author {karthik}
 * @export
 * @interface SenderRequest
 */
export interface SenderRequest {

    loan_num: string;

    src: string;

    message: string;

    to: ReceiverInfo[];
}

export interface MarkReadRequest {

    loan_num: string;

    src: string;

    message_ids: number[];

}
