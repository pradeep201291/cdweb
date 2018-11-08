import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AppSettings } from './../../../app/core/global-configuration/settings';

import { StearnsHttpClient } from './../../infrastructure/http-client/http-client.service';
import { ApiResponse } from './../../infrastructure/api-response.typedef';
import { Announcement } from './announcement.typedef';

@Injectable()
export class AnnouncementService {

    /**
     * The constructor.
     * @param _http: Http
     * @param appConfig: AppSettings
     */
    constructor(private _http: StearnsHttpClient, private appConfig: AppSettings) {
    }

    /**
     * Gets announcements
     */
    getAnnouncements(): Observable<ApiResponse<Announcement[]>> {
        let announcementUrl = this.appConfig.serviceConfig.baseUrl + this.appConfig.serviceConfig.getAnnouncementsUrl;
        let result = this._http.getAnnouncement(announcementUrl)
            .map((response: Response) => response.json());
        return result;
    }
}
