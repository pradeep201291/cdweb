import { Injectable } from '@angular/core';

import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { StearnsHttpClient } from './../../sl-ui-framework/infrastructure/http-client/http-client.service';
import { ApiResponse } from './../../sl-ui-framework/infrastructure/api-response.typedef';
import { AppSettings } from './../core/global-configuration/settings';
import { UploadDocumentModel, UploadDocumentResponse } from './models/upload-document.model';
/**
 * A service for document upload
 * 
 * @export
 * @class DocumentUploadService
 */
@Injectable()
export class DocumentUploadService {
    /**
     * Creates an instance of DocumentUploadService.
     * 
     * @param {StearnsHttpClient} http
     * @param {AppSettings} appSettings
     * 
     * @memberOf DocumentUploadService
     */
    constructor(private http: StearnsHttpClient, private appSettings: AppSettings) {

    }

    /**
     * Upload Document API
     * 
     * @param {UploadDocumentModel} document
     * @returns {Observable<UploadDocumentResponse>}
     * 
     * @memberOf DocumentUploadService
     */
    uploadDocument(document: UploadDocumentModel): Observable<ApiResponse<UploadDocumentResponse>> {
        let url = this.appSettings.serviceConfig.baseUrl + this.appSettings.serviceConfig.uploadDocumentUrl;

        return this.http.post(url, document)
            .map((response: Response) => response.json())
            .catch(error => Observable.throw(error));
    }
}
