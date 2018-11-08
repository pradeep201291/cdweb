import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Loan } from './../models/loan.model';
import { Condition } from './../models/condition-list.model';
import { FileInfo, UploadStatus } from './../models/file.model';
import { GlobalConstants } from './../../core/global-constant/global-constant';
import { StateProviderService } from './../../core/state-provider.service';
import { DocumentSelectorService } from './document-selector.service';
import { GooglePickerService } from '../../shared/service/google-picker.service';
import { FileUploadSummary } from './file-upload-summary.typedef';
import { FileUploadConstants } from './file-upload.constants';

import { AppSettings } from './../../core/global-configuration/settings';
declare var $: any;
declare var Dropbox: any;
declare var google: any;
/**
 * 
 * 
 * @export
 * @class DocumentSelectorComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'document-selector',
    templateUrl: './document-selector.component.html',
    providers: [DocumentSelectorService, GooglePickerService]
})
export class DocumentSelectorComponent implements OnInit {
    private _selectedLoan: Loan;

    @Input()
    get selectedLoan(): Loan {
        return this._selectedLoan;
    }
    set selectedLoan(value: Loan) {
        this._selectedLoan = value;
        if (this._selectedLoan) {
            let uploadedFiles = sessionStorage.getItem(FileUploadConstants.UploadSummaryStorageKey);
            if (uploadedFiles) {
                this.uploadedFiles = JSON.parse(uploadedFiles);
                this.uploadedFilesForLoan = this.uploadedFiles.filter(e => e.loanNumber === this.selectedLoan.loan_num);
            } else {
                this.uploadedFiles = [];
                this.uploadedFilesForLoan = [];
            }
        }
    }

    @Input() conditions: Condition[];
    @Output() uploadButtonHandler = new EventEmitter<FileInfo>();
    @Output() closeButtonHandler = new EventEmitter<boolean>();

    private _uploadStatus: UploadStatus;
    selectedFile: FileInfo;
    showConditions: boolean;
    isInDocumentSelection: boolean;
    isInUploadSection: boolean;
    isInSummarySection: boolean;
    validationMessage: string;
    acceptedFileTypes: string;
    fileRestrictionMessage: string;
    selectedFiles: FileInfo[] = [];
    private isDocumentSelectionInProgress: boolean;
    uploadedFiles: FileUploadSummary[];
    uploadedFilesForLoan: FileUploadSummary[];
    uploadButtonName: string = '';
    get uploadStatus(): UploadStatus {
        return this._uploadStatus;
    }

    set uploadStatus(value: UploadStatus) {
        this._uploadStatus = value;
        this.uploadButtonName = 'Upload';
        // if (this._uploadStatus === UploadStatus.Successful) {
        //     this.successHandler();
        // } else
        if (this._uploadStatus === UploadStatus.Failure) {
            this.uploadButtonName = 'Try Again';
        }
    }
    /**
     * Returns all the selected conditions
     * 
     * @readonly
     * @type {Condition[]}
     * @memberOf DocumentSelectorComponent
     */
    get selectedConditions(): Condition[] {
        return this.conditions.filter(e => e.is_selected);
    }
    /**
     * A method for enable/disabled Choose document button.
     * 
     * @readonly
     * @type {boolean}
     * @memberOf DocumentSelectorComponent
     */
    get canChooseDocument(): boolean {
        /**
         * If no conditions are  selected. then disable the button
         */
        return this.conditions.some(e => e.is_selected) ? false : true;
    }

    /**
    * Creates an instance of DocumentSelectorComponent.
    * 
    * @param {StateProviderService} state
    * @param {Router} router
    * 
    * @memberOf DocumentUploadProgressComponent
    */
    constructor(private router: Router,
        private state: StateProviderService,
        private documentSelectorService: DocumentSelectorService,
        private ngZone: NgZone,
        private googlePickerService: GooglePickerService,
        private location: Location,
        private appSettings: AppSettings) {
    }
    /**
     * 
     * 
     * 
     * @memberOf DocumentSelectorComponent
     */
    ngOnInit() {
        this.acceptedFileTypes = GlobalConstants.acceptedFileList;
        this.fileRestrictionMessage = GlobalConstants.fileUploadRestrictionMessage;
        this.uploadButtonName = 'Upload';
    }

    /**
     * 
     * 
     * 
     * @memberOf DocumentSelectorComponent
     */
    uploadFileHandler() {
        if (!this.isDocumentSelectionInProgress) {
            this.isDocumentSelectionInProgress = true;
            $('#documentSelector').modal('hide');
            $('#fileUpload').click();
        }
    }

    private showUploadStatus() {
        $('#uploadStatus').modal('show');
        this.uploadStatus = UploadStatus.Selected;
    }

    /**
     * Uploads the document from dropbox.
     * 
     * 
     * @memberOf DocumentSelectorComponent
     */
    uploadFromDropBox() {
        let self = this;
        self.validationMessage = null;
        let options = {

            // Required. Called when a user selects an item in the Chooser.
            success: function (files: any[]) {
                if (files[0].bytes > GlobalConstants.fileUploadSieLimit) {
                    self.ngZone.run(() => {
                        self.validationMessage = GlobalConstants.fileSizeLimitValidationMessage;
                    });
                } else {
                    let downloadTask = self.documentSelectorService.getDocumentFromDropBox(files[0].link);
                    downloadTask.subscribe(result => {

                        let blob = result.json();
                        let fileReader = new FileReader();
                        fileReader.addEventListener('load', function () {
                            let header = ';base64,';
                            let content = fileReader.result;
                            let headerIndex = content.indexOf(header, header.length);
                            let base64 = content.substring(headerIndex).replace(header, '');
                            self.selectedFile = {
                                lastModifiedDate: new Date(),
                                name: files[0].name,
                                size: files[0].bytes,
                                type: files[0].name.substring(files[0].name.indexOf('.') + 1),
                                showConditions: false,
                                uploadStatus: UploadStatus.InProgress,
                                content: base64,
                                loanNumber: self.selectedLoan.loan_num,
                                conditions: []
                            };
                            // self.addFile();
                            self.showUploadStatus();

                        });
                        fileReader.readAsDataURL(blob);
                    });
                }
            },
            // Optional. "preview" (default) is a preview link to the document for sharing,
            // "direct" is an expiring link to download the contents of the file. For more
            // information about link types, see Link types below.
            linkType: 'direct', // or "preview"

            // Optional. A value of false (default) limits selection to a single file, while
            // true enables multiple file selection.
            multiselect: false, // or true

            // Optional. This is a list of file extensions. If specified, the user will
            // only be able to select files with these extensions. You may also specify
            // file types, such as "video" or "images" in the list. For more information,
            // see File types below. By default, all extensions are allowed.
            extensions: GlobalConstants.validFileExtensions,
        };

        $('#documentSelector').modal('hide');
        Dropbox.choose(options);
    }

    /**
     * 
     * 
     * 
     * @memberOf DocumentSelectorComponent
     */
    chooseDocument() {
        this.isDocumentSelectionInProgress = false;
        $('#documentSelector').modal('show');
    }

    done() {
        this.location.back();
    }




    /**
     * File change event handler
     * 
     * @param {*} event
     * 
     * @memberOf DocumentSelectorComponent
     */
    fileChangeEvent(event: any) {
        let file = event.target.files[0];
        this.selectedFileChange(file);
    }

    /**
     * 
     * 
     * 
     * @memberOf DocumentSelectorComponent
     */
    uploadFromGoogleDrive() {
        let self = this;
        // doc selector is hidden by post selection
        $('#documentSelector').modal('hide');
        let googleDrive = this.appSettings.cloudDrive.googleDrive;
        let pickerData = {
            clientId: googleDrive.clientId,
            appId: googleDrive.appId,
            apiKey: googleDrive.developerKey,
            locale: googleDrive.locale,
            scope: googleDrive.scope,
            origin: window.location.href
        };

        this.googlePickerService.getPickerResponse(pickerData, (err: any, file: any, oauthToken: string) => {
            this.validationMessage = null;
            if (err) {
            }
            if (file) {
                if (file.sizeBytes > GlobalConstants.fileUploadSieLimit) {
                    self.ngZone.run(() => {
                        self.validationMessage = GlobalConstants.fileSizeLimitValidationMessage;
                    });
                } else {
                    self.documentSelectorService.getDocumentFromGoogleDrv(googleDrive.driveApi + file.id, oauthToken)
                        .subscribe(response => {
                            let downloadTask = self.documentSelectorService
                                .getDocumentFromGoogleDrv(response['downloadUrl'] + '&access_token=' + oauthToken, null);
                            downloadTask.subscribe((result: any) => {
                                let blob = result;
                                let fileReader = new FileReader();
                                fileReader.addEventListener('load', function () {
                                    let header = ';base64,';
                                    let content = fileReader.result;
                                    let headerIndex = content.indexOf(header, header.length);
                                    let base64 = content.substring(headerIndex).replace(header, '');
                                    self.ngZone.run(() => {
                                        self.selectedFile = {
                                            lastModifiedDate: new Date(),
                                            name: file.name,
                                            size: file.sizeBytes,
                                            type: file.name.substring(file.name.indexOf('.') + 1),
                                            showConditions: false,
                                            uploadStatus: UploadStatus.InProgress,
                                            content: base64,
                                            loanNumber: self.selectedLoan.loan_num,
                                            conditions: []
                                        };
                                        self.showUploadStatus();
                                    });
                                });
                                fileReader.readAsDataURL(blob);
                            });
                        });
                }
            }
        });
    }

    /**
     * 
     * Upload the selected file
     * 
     * @memberOf DocumentSelectorComponent
     */
    upload() {
        this.validationMessage = null;
        this.uploadStatus = UploadStatus.InProgress;
        this.selectedFile.conditions = this.selectedConditions;
        this.uploadButtonHandler.emit(this.selectedFile);
    }

    close() {
        this.closeButtonHandler.emit(true);
        this.successHandler();
    }

    loadDocuments() {
        this.router.navigate(['/documents']);
    }

    /**
     * 
     * 
     * @private
     * 
     * @memberOf DocumentSelectorComponent
     */
    private successHandler() {
        $('#uploadStatus').modal('hide');
        let selectedFile = [{
            loanNumber: this.selectedLoan.loan_num,
            fileName: this.selectedFile.name,
            conditions: this.selectedFile.conditions.map(e => e.cond_desc)
        }];
        this.uploadedFilesForLoan.push(...selectedFile);
        this.uploadedFiles.push(...selectedFile);
        sessionStorage.setItem(FileUploadConstants.UploadSummaryStorageKey, JSON.stringify(this.uploadedFiles));
    }

    private selectedFileChange(file: any) {
        this.selectedFile = null;
        this.validationMessage = null;
        if (file) {
            if (!GlobalConstants.fileUploadTypes.find(x => x === file.type) || file.name.includes('.jfif')) {
                this.validationMessage = GlobalConstants.fileTypeRestrictionValidationMessage;
                $('#documentSelector').modal('hide');
                return;
            }
            if (file.size <= GlobalConstants.fileUploadSieLimit) {
                let reader = new FileReader();
                reader.addEventListener('load', function () {
                    // update the selected file once the file content is read to base64 string
                    this.selectedFile = file;
                    /**
                     * The string content will contain a header information 'application/{file_type};base64,'
                     * remove that header information and convert it to raw base64
                     **/
                    let header = ';base64,';
                    let content = reader.result;
                    let index = content.indexOf(header, header.length);
                    let base64 = content.substring(index).replace(header, '');
                    this.selectedFile.content = base64;
                    this.selectedFile.loanNumber = this.selectedLoan.loan_num;
                    this.showUploadStatus();

                }.bind(this), false);
                reader.readAsDataURL(file);
            } else {
                this.validationMessage = GlobalConstants.fileSizeLimitValidationMessage;
            }

        }
        $('#fileUpload').val('');
        $('#documentSelector').modal('hide');
    }

    /**
     * 
     * 
     * @param {File} files
     * 
     * @memberOf DocumentSelectorComponent
     */
    getdroppedFiles(files: File) {
        if (files) {
            this.selectedFileChange(files);
        }
    }
}
