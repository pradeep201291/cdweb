/**
 * Document page view document component
 * 
 */
import { Component, Input } from '@angular/core';

import { DocumentService } from '../documents.service';
import { Document, DocumentData, Loan } from '../documents.model';
import * as _ from 'lodash';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { PagerService } from './../../../sl-ui-framework/infrastructure/pagination/pagination.service';
declare var $: any;
declare var Tiff: any;
const AssetsPlugin = require('file-saver');
const docType = {
    text: 'text/plain',
    pdf: 'application/pdf',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    gif: 'image/gif',
    png: 'image/png',
    tif: 'image/tiff',
    tiff: 'image/tiff'
};
const docIcon = {
    txt: 'txttype-icon',
    pdf: 'pdftype-icon',
    jpeg: 'imgtype-icon',
    jpg: 'imgtype-icon',
    gif: 'imgtype-icon',
    png: 'imgtype-icon',
    tif: 'imgtype-icon',
    tiff: 'imgtype-icon',
    doc: 'doctype-icon',
    default: 'doc-icon'
};
@Component({
    selector: 'sl-view-documents',
    templateUrl: './view-documents.component.html',
    providers: []
})
export class ViewDocumentPage {
    isIeOrSafari: boolean;
    currentLoan: Loan;
    isDocumentsLoaded: boolean = false;
    ispdf: boolean = false;
    isTiff: boolean = false;

    /**
     * documentName
     * 
     * @type {string}
     * @memberOf ViewDocumentPage
     */
    documentName: string;

    /**
     * 
     * 
     * @type {Loan}
     * @memberOf ViewDocumentPage
     */
    @Input() set selectedLoan(value: Loan) {
        if (value) {
            this.currentLoan = value;
            this.getDocuments();
        }
    }
    /**
     * document
     * 
     * @type {Documents[]}
     * @memberOf ViewDocumentPage
     */
    documents: Document[];

    /**
     * pager
     * 
     * @type {*}
     * @memberOf ViewDocumentPage
     */
    pager: any = {};

    /**
     * pagedItems
     * 
     * @type {any[]}
     * @memberOf ViewDocumentPage
     */
    pagedItems: any[];

    /**
     * Document Data for view
     * 
     * @type {DocumentData}
     * @memberOf ViewDocumentPage
     */
    documentData: DocumentData;

    /**
     * 
     * 
     * @type {string}
     * @memberOf ViewDocumentPage
     */
    sortBy: string = '';

    /**
     * 
     * 
     * @type {string}
     * @memberOf ViewDocumentPage
     */
    sortOrder: string = '';

    /**
     * imageUrl
     * 
     * @type {string}
     * @memberOf ViewDocumentPage
     */
    imageUrl: string;


    /**
     * 
    * 
    * @type {*}
    * @memberOf ViewDocumentPage
    */
    sanitizedUrl: SafeResourceUrl;

    /**
     * 
     * 
     * @type {*}
     * @memberOf ViewDocumentPage
     */
    binary: any;

    /**
     * pagedDocuments
     * 
     * @type {Document[]}
     * @memberOf ViewDocumentPage
     */
    pagedDocuments: Document[] = [];

    /**
     * currentPage
     * 
     * @type {number}
     * @memberOf ViewDocumentPage
     */
    currentPage: number = 0;

    /**
     * decodedString
     * 
     * @type {string}
     * @memberOf ViewDocumentPage
     */
    decodedString: string;

    /**
     * Creates an instance of ViewDocumentPage.
     * 
     * @param {DocumentService} documentService
     * 
     * @memberOf ViewDocumentPage
     */
    constructor(private documentService: DocumentService, private sanitizer: DomSanitizer, private pagerService: PagerService) {
    }

    /**
     * Gets the documents
     * 
     * 
     * @memberOf ViewDocumentPage
     */
    getDocuments() {
        if (this.documentService.isDocumentUploaded) {
            this.sortOrder = 'desc';
            this.sortBy = 'last_update_datetime';
        }
        this.documentService.getLoanDocuments(this.currentLoan.loan_num, this.currentLoan.src)
            .subscribe((response) => {
                this.documents = response.data;
                if (this.sortOrder !== '' && this.sortBy !== '') {
                    this.sortNeeds(this.sortBy, this.sortOrder);
                } else if (this.documents.length > 0) {
                    this.setPage(1);
                } else if (this.documents.length === 0) {
                    this.pagedDocuments = [];
                }
                this.isDocumentsLoaded = true;
            });
    }

    /**
     * Makes database call and convert the image and download it
     * 
     * @param {string} id
     * 
     * @memberOf ViewDocumentPage
     */
    viewDocument(document: Document) {
        this.sanitizedUrl = '';
        this.decodedString = '';
        this.documentName = document.document_name;
        this.documentService.viewDocuments(this.currentLoan.src, this.currentLoan.loan_num, document.document_id)
            .subscribe((response) => {
                this.documentData = response.data;
                let documentType = this.documentData.document_type;
                _.isUndefined(docType[documentType.toLowerCase()]) ? documentType = docType.text :
                    documentType = docType[documentType.toLowerCase()];
                this.binary = this.convertStringToData(this.documentData.image, documentType);
                this.isIeOrSafari = this.ispdf = this.isTiff = false;
                this.imageUrl = URL.createObjectURL(this.binary);

                this.ispdf = (documentType === docType.pdf);

                if (documentType === docType.text) {
                    this.decodedString = atob(this.documentData.image);
                }
                if (documentType !== docType.tif && documentType !== docType.pdf &&
                    documentType !== docType.text && documentType !== docType.tiff) {
                    if (window.navigator.msSaveOrOpenBlob ||
                        (navigator.userAgent.search('Safari') >= 0 && navigator.userAgent.search('Chrome') < 0)) {
                        this.isIeOrSafari = true;
                    }
                }
                if (documentType === docType.tif || documentType === docType.tiff) {
                    this.isTiff = true;
                    this.renderTiff(this.binary);
                }

                if ((this.imageUrl && !_.isUndefined(this.imageUrl)) || (this.binary && !_.isUndefined(this.binary))
                    && documentType !== docType.tif && documentType !== docType.tiff) {
                    $('#documentView').modal('show');
                }

            });
    }

    renderTiff(binary: any) {
        if (binary && !_.isUndefined(binary)) {
            let fileReader = new FileReader();
            fileReader.addEventListener('load', function () {
                Tiff.initialize({
                    TOTAL_MEMORY: 100000000
                });
                let tiff = new Tiff({
                    buffer: fileReader.result
                });
                let tiffCanvas = tiff.toCanvas();
                $(tiffCanvas).css({
                    'width': '70%',
                    'height': '100%',
                    'display': 'inline-block',
                    'overflow-y': 'auto'
                }).addClass('preview');
                $('#documentView .modal-body').append(tiffCanvas);
            });
            fileReader.onloadend = function (e) {
                $('#documentView').modal('show');
            };

            fileReader.readAsArrayBuffer(binary);
        }
    }

    /**
     * 
     * open the modal for view document
     * 
     * @memberOf ViewDocumentPage
     */
    closeModal() {
        $('#documentView .preview').remove();
        $('#documentView').modal('hide');
    }

    /**
     * Converts the database object of type string back to desired type to download
     * 
     * @param {string} b64Data
     * @param {string} contentType
     * @returns
     * 
     * @memberOf ViewDocumentPage
     */
    convertStringToData(b64Data: string, contentType: string) {
        contentType = contentType || '';
        let sliceSize = 512;
        b64Data = b64Data.replace(/^[^,]+,/, '');
        b64Data = b64Data.replace(/\s/g, '');
        let byteCharacters = window.atob(b64Data);
        let byteArrays: Int8Array[] = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);

            let byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            let byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        let blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }


    /**
     * Sort the fields for Document Name, Category, updated user name, updated date time
     * 
     * @param {string} field
     * @param {string} sortOrder
     * 
     * @memberOf ViewDocumentPage
     */
    sortNeeds(field: string, sortOrder: string) {
        this.sortBy = field;
        this.sortOrder = sortOrder;

        if (field === 'document_name') {
            this.documents = _.orderBy(this.documents, [(e) => e.document_name.toLowerCase()], [sortOrder]);
        } else if (field === 'last_update_datetime') {
            this.documents = _.orderBy(this.documents, [field], [sortOrder]);
        }
        if (this.documents.length > 0) {
            this.setPage(1);
        }
    }


    /**
     * Helps in moving to next page
     * 
     * 
     * @memberOf ViewDocumentPage
     */
    next() {
        this.setPage(this.pager.endPage + 1, false);
    }


    /**
     * 
     * Helps in moving to previous page
     * 
     * @memberOf ViewDocumentPage
     */
    previous() {
        this.setPage(this.pager.startPage - 1, false);
    }

    /**
     * Helps in Tracking current page
     * 
     * @param {number} page
     * 
     * @memberOf ViewDocumentPage
     */
    setCurrentPage(page: number) {
        this.currentPage = page;
        this.setPage(page);
    }

    /**
     * Interacts with service to get pagination logic
     * 
     * @param {number} page
     * @param {boolean} [withinTheFrame=true]
     * @returns
     * 
     * @memberOf ViewDocumentPage
     */
    setPage(page: number, withinTheFrame = true) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this.pagerService.getPager(this.documents.length, page, withinTheFrame);
        this.pagedDocuments = this.documents.slice(this.pager.startIndex, this.pager.endIndex + 1);
        let test = this.pagedDocuments.length;
        console.log(test);
        this.currentPage = this.pager.currentPage;
    }

    downloadImage() {
        AssetsPlugin.saveAs(this.binary, this.documentData.document_name);
    }

    setDocumentIcon(doctype: string) {
        if (!doctype && doctype === null) {
            doctype = 'default';
        }
        if (!docIcon[doctype.trim().toLowerCase()]) {
            doctype = 'default';
        }
        return docIcon[doctype.trim().toLowerCase()];
    }
}


