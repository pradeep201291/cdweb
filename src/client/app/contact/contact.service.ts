import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


import { GetContactRequest } from './contact.typedef';
import { ContactData } from './contact.typedef';
import { StearnsHttpClient } from './../../sl-ui-framework/infrastructure/http-client/http-client.service';
import { ApiResponse } from './../../sl-ui-framework/infrastructure/api-response.typedef';

import { AppSettings } from './../core/global-configuration/settings';


@Injectable()

export class ContactCardService {

    constructor(private http: StearnsHttpClient, private appConfig: AppSettings) { }

    getcontactCards(request: GetContactRequest): Observable<ApiResponse<ContactData>> {
        let serviceUrl = this.appConfig.serviceConfig.baseUrl +
                            this.appConfig.serviceConfig.methodUrl +
                            this.appConfig.serviceConfig.getContactUrl;
        return this.http.post(serviceUrl, request)
            .map((response: Response) => <ApiResponse<ContactData>>response.json());
    }

}
