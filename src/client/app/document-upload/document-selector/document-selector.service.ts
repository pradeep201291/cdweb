import { Injectable } from '@angular/core';
import { Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { StearnsHttpClient } from './../../../sl-ui-framework/infrastructure/http-client/http-client.service';

/**
 * 
 * 
 * @export
 * @class DocumentSelectorService
 */
@Injectable()
export class DocumentSelectorService {

    /**
     * Creates an instance of DocumentSelectorService.
     * 
     * @param {StearnsHttpClient} _http
     * 
     * @memberOf DocumentSelectorService
     */
    constructor(private _http: StearnsHttpClient) {

    }

    /**
     * 
     * Get document from dropbox as blob.
     * @param {string} url
     * @returns {Observable<Response>}
     * 
     * @memberOf DocumentSelectorService
     */
    getDocumentFromDropBox(url: string): Observable<Response> {
        return this._http.get(url, ResponseContentType.Blob, 'text/plain; charset=dropbox-cors-hack', true)
            .map((response: Response) => response);
    }

     getDocumentFromGoogleDrv(url: string, token?: string): Observable<Response> {
        let result = this._http.getDocumentFromGoogleDrv(url, token)
            .map((response: Response) => response.json());
        return result;
    }
}
