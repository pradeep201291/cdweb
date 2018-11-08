/**
 * Document Service
 */
import { Injectable } from '@angular/core';
import { Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { AppSettings } from './../core/global-configuration/settings';
import { StearnsHttpClient } from './../../sl-ui-framework/infrastructure/http-client/http-client.service';
import { ApiResponse } from './../../sl-ui-framework/infrastructure/api-response.typedef';

import { Document, DocumentData, UploadDocumentModel, UploadDocumentResponse } from './documents.model';

@Injectable()
export class DocumentService {

    isDocumentUploaded: boolean = false;
    /**
     * Creates an instance of DocumentService.
     * 
     * @param {StearnsHttpClient} _http
     * @param {AppSettings} appSettings
     * 
     * @memberOf DocumentService
     */
    constructor(private _http: StearnsHttpClient, private appSettings: AppSettings) {
    }



    /**
     * Get documents for the Loan Number
     * 
     * @param {string} loan_num
     * @param {string} src
     * @returns {Observable<DocumentList>}
     * 
     * @memberOf DocumentService
     */
    getLoanDocuments(loan_num: string, src: string): Observable<ApiResponse<Document[]>> {
        let conditionListApi = this.appSettings.serviceConfig.baseUrl + this.appSettings.serviceConfig.documentsUrl;
        return this._http.post(conditionListApi, { loan_num, src })
            .map((response: Response) => response.json());
    }


    /**
     * Get the data to download the document by document ID
     * 
     * @param {string} loan_num
     * @param {string} src
     * @param {string} id
     * @returns {Observable<DocumentList>}
     * 
     * @memberOf DocumentService
     */
    viewDocuments(src: string, loan_num: string, document_id: string): Observable<ApiResponse<DocumentData>> {
        let conditionListApi = this.appSettings.serviceConfig.baseUrl + this.appSettings.serviceConfig.viewDocumentsUrl;
        return this._http.post(conditionListApi, { src, loan_num, document_id })
            .map((response: Response) => response.json());
    }

    /**
     * 
     * Get the document as blob from Dropbox
     * @param {string} url
     * @returns {Observable<Response>}
     * 
     * @memberOf DocumentService
     */
    getDocumentFromDropBox(url: string): Observable<Response> {
        return this._http.get(url, ResponseContentType.Blob, 'text/plain; charset=dropbox-cors-hack', true)
            .map((response: Response) => response);
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

        return this._http.post(url, document)
            .map((response: Response) => response.json())
            .catch(error => Observable.throw(error));
    }

    getDocumentFromGoogleDrv(url: string, token?: string): Observable<Response> {
        let result = this._http.getDocumentFromGoogleDrv(url, token)
            .map((response: Response) => response.json());
        return result;
    }


}
