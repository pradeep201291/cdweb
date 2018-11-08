
export interface NotificationCountInfo {
    total_unread_count: number;
    snap_count: number;
    blast_count: number;
}


export interface Notification {
    message_id: number;
    notification_type: number;
    status_type: number;
    message_text: string;
    link: string;
    message_date: Date;
    isSelected: boolean;
}

export interface UnreadNotificationCount {
    total_unread_count: number;
}
