import { Injectable } from '@angular/core';
import { SharedResource } from './data-store.resource';
import * as _ from 'lodash';

interface DeviceStore {
    userId: string;
    deviceGuid: string;
}

@Injectable()
export class DataStoreService {
    requestCount: number;
    set RequestCount(value: number) {
        this.requestCount = value;
        sessionStorage.setItem(SharedResource.borrower_request_count, value.toString());
    }
    get RequestCount() {
        return this.requestCount;
    }

    constructor() {
        this.RequestCount = 0;
    }
    /**
     * @desc set device id 
     * 
     * 
     * @memberOf DataStoreService
     */
    setDeviceId() {
        let local_deviceItems: Array<DeviceStore> = JSON.parse(localStorage.getItem(SharedResource.device_ID));
        let user_Id = this.getUserId();
        let uniqueId = this.getDeviceId();
        if (local_deviceItems && local_deviceItems !== null) {
            local_deviceItems.push({ userId: user_Id, deviceGuid: uniqueId });
            localStorage.setItem(SharedResource.device_ID, JSON.stringify(local_deviceItems));
        } else {
            let deviceCollection = new Array<DeviceStore>();
            deviceCollection.push({ userId: user_Id, deviceGuid: uniqueId });
            localStorage.setItem(SharedResource.device_ID, JSON.stringify(deviceCollection));
        }
    }

    /**
     * @desc is device id available for a user
     * 
     * @returns {boolean}
     * 
     * @memberOf DataStoreService
     */
    hasDeviceId(userName?: string): boolean {
        let local_deviceItems: Array<DeviceStore> = JSON.parse(localStorage.getItem(SharedResource.device_ID));
        if (!userName) {
            userName = this.getUserId();
        }

        if (local_deviceItems && local_deviceItems !== null) {
            let deviceStore = _.find(local_deviceItems, (each) => {
                return each.userId === userName && each.deviceGuid !== '';
            });
            return (deviceStore && deviceStore !== null && !_.isUndefined(deviceStore));
        }
        return false;
    }

    /**
     * @desc det device id for a user
     * 
     * @param {string} [userId]
     * @returns {string}
     * 
     * @memberOf DataStoreService
     */
    getDeviceId(userId?: string): string {
        /***
         * Get all the users registered in this device;
         */
        let local_deviceItems: Array<DeviceStore> = JSON.parse(localStorage.getItem(SharedResource.device_ID));
        /**
         * Get the device id for session
         */
        let session_device_id: string = (sessionStorage.getItem(SharedResource.device_ID));

        /**
         * Find the user is logged in or not
         */
        let user_Id = this.getUserId();
        if (!user_Id) {
            /** If user is not logged in take input parameter */
            user_Id = userId;
        }
        let currentUserInfo: DeviceStore;
        /** If there are any users registered in this device */
        if (local_deviceItems && local_deviceItems !== null) {
            /** Find the device id for this user */
            currentUserInfo = _.find(local_deviceItems, (each) => {
                return each.userId === user_Id;
            });
        }
        /**
         * If the logged in user is registered in this device, return device id
         */
        if (currentUserInfo) {
            return currentUserInfo.deviceGuid;
        }
        /** Otherwwise take it from session */
        if (session_device_id && session_device_id !== null) {
            return session_device_id;
        } else {
            /** If not present in session, add it to session and then return */
            let uniqueId = this.generateGuid();
            sessionStorage.setItem(SharedResource.device_ID, uniqueId);
            return uniqueId;
        }
    }


    /**
     * 
     * 
     * @returns
     * 
     * @memberOf DataStoreService
     */
    getUserId() {
        let userSessionDetails = JSON.parse(sessionStorage.getItem(SharedResource.currentUser));
        if (userSessionDetails && userSessionDetails !== null) {
            return userSessionDetails.UserId;
        }
        return null;
    }

    /**
     * 
     * 
     * @returns
     * 
     * @memberOf DataStoreService
     */
    getAccessToken() {
        let userSessionDetails = JSON.parse(sessionStorage.getItem(SharedResource.currentUser));
        if (userSessionDetails && userSessionDetails !== null) {
            return userSessionDetails.access_token;
        }
        return null;
    }

    /**
     * @desc company code retrieved from private label json
     * 
     * @returns
     * 
     * @memberOf DataStoreService
     */
    getCompanyCode() {
        return sessionStorage.getItem(SharedResource.companyCode);
    }

    /**
     * 
     * 
     * @private
     * @returns
     * 
     * @memberOf DataStoreService
     */
    private getRandomChar() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    /**
     * 
     * 
     * @private
     * @returns
     * 
     * @memberOf DataStoreService
     */
    private generateGuid() {
        return this.getRandomChar() + this.getRandomChar() + '-' + this.getRandomChar() + '-' + this.getRandomChar() + '-' +
            this.getRandomChar() + '-' + this.getRandomChar() + this.getRandomChar() + this.getRandomChar();
    }

    /**
     * @desc user information 
     * 
     * @returns
     * 
     * @memberOf DataStoreService
     */
    getUserFromSession() {
        let userSessionDetails = JSON.parse(sessionStorage.getItem(SharedResource.currentUser));
        if (userSessionDetails && userSessionDetails !== null) {
            return {
                UserId: userSessionDetails.UserId,
                password: userSessionDetails.password,
                FirstName: userSessionDetails.FirstName,
                LastName: userSessionDetails.LastName,
                email: userSessionDetails.email,
                access_token: userSessionDetails.access_token,
                refresh_token: userSessionDetails.refresh_token,
                expires_in: userSessionDetails.expires_in,
                issued: userSessionDetails.issued,
                expires: userSessionDetails.expires
            };
        }
        return null;
    }

    updateUserDetails(tokenInfo: any) {
        let userSessionDetails = JSON.parse(sessionStorage.getItem(SharedResource.currentUser));
        console.log(userSessionDetails);
        if (userSessionDetails && userSessionDetails !== null) {
            let temp = Object.assign({}, userSessionDetails);
            temp['access_token'] = tokenInfo.access_token;
            temp['refresh_token'] = tokenInfo.refresh_token;
            temp['expires_in'] = tokenInfo.expires_in;
            temp['issued'] = tokenInfo['.issued'];
            temp['expires'] = tokenInfo['.expires'];
            sessionStorage.setItem(SharedResource.currentUser, JSON.stringify(temp));
        }
    }

    getRefreshToken() {
        let userSessionDetails = JSON.parse(sessionStorage.getItem(SharedResource.currentUser));
        if (userSessionDetails && userSessionDetails !== null) {
            return userSessionDetails.refresh_token;
        }
        return null;
    }

    getClientSession(): string {
        let session_id: string = sessionStorage.getItem(SharedResource.borrower_session);
        if (session_id && session_id !== null) {
            return session_id;
        } else {
            let uniqueId = this.generateGuid();
            sessionStorage.setItem(SharedResource.borrower_session, uniqueId);
            return uniqueId;
        }
    }

    getRequestCount(): number {
        let count: string = sessionStorage.getItem(SharedResource.borrower_request_count);
        if (!count && _.isUndefined(count)) {
            this.RequestCount = 1;
            return 1;
        };
        let val = Number(count);
        this.RequestCount = ++val;
        return this.RequestCount;
    }
}
