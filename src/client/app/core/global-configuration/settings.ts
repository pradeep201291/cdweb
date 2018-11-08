/**
 * 
 * 
 * @export
 * @class ServiceConfig
 */
export class ServiceConfig {
    baseUrl: string;
    AuthUrl: string;
    loginUrl: string;
    logOutUrl: string;
    methodUrl: string;
    lookupUrl: string;
    getAllSummaryForUserUrl: string;
    getSummaryForLoanUrl: string;
    getDashboardForLoanUrl: string;
    getMyLoansUrl: string;
    getContactUrl: string;
    getAnnouncementsUrl: string;
    getNotificationsCount: string;
    getNotificationsForLoan: string;
    markNotificationAsRead: string;
    markNotificationAsUnRead: string;
    deleteNotification: string;
    getBroadcastNotifications: string;
    openSameTab: string;
    sendTokenUrl: string;
    resetPassswordUrl: string;
    changePasswordUrl: string;
    setFirstTimePassswordUrl: string;
    getLoanDetailUrl: string;
    getCustomerContactUrl: string;
    getMessageDataForLoan: string;
    getUnreadCount: string;
    postMessageForLoan: string;
    getConditionsUrl: string;
    uploadDocumentUrl: string;
    markUnreadUrl: string;
    documentsUrl: string;
    viewDocumentsUrl: string;
    updateProfileUrl: string;
    getFormWidgetUrl: string;
    getNeedListUrl: string;
    updateConsentUrl: string;
    getDocutechSso: string;
}


/**
 * 
 * 
 * @export
 * @class Security
 */
export class Security {
    userName: string;
    userType: string;
    userSession: number;
    token: string;
    idleTimeout: number;
    popupTimeout: number;
}

/**
 * @export
 * @class AppVersion
 */
export class AppVersion {
    appVersion: string;
}


/**
 * @export
 * @class googleDrive
 */
export class GoogleDrive {
    developerKey: string;
    clientId: string;
    appId: string;
    scope: string;
    driveApi: string;
    locale: string;
}


/**
 * @export
 * @class dropbox
 */
export class Dropbox {
    appKey: string;
}

/**
 * @export
 * @class cloudDrive
 */
export class CloudDrive {
    googleDrive: GoogleDrive;
    dropbox: Dropbox;
}

/**
 * 
 * 
 * @export
 * @class AppSettings
 */
export class AppSettings {
    serviceConfig: ServiceConfig;
    security: Security;
    version: string;
    cloudDrive: CloudDrive;
    encodePassword: boolean;
}
