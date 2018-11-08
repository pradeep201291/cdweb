import { Component, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Loan } from '../documents.model';
import { DocumentService } from '../documents.service';

import { FileInfo, UploadStatus } from './upload-documents.model';
import { UploadDocumentResponse } from './../documents.model';
import { GlobalConstants } from './../../core/global-constant/global-constant';
import { ApiResponse } from './../../../sl-ui-framework/infrastructure/api-response.typedef';

import { GooglePickerService } from '../../shared/service/google-picker.service';

import { AppSettings } from './../../core/global-configuration/settings';


declare var $: any;
declare var Dropbox: any;


@Component({
    selector: 'sl-upload-documents',
    templateUrl: './upload-documents.component.html',
    providers: [GooglePickerService]
})
export class UploadDocumentPage {
    selectedFile: FileInfo;
    validationMessage: string;
    initialValidationMessage: string;
    selectedFiles: FileInfo[] = [];
    uploadedFiles: FileInfo[] = [];
    fileCount: number = 0;
    sameFileError: string;
    isRetryVisible: boolean = false;
    isUploadClicked: boolean = false;
    currentLoan: Loan;
    validFiles: any[];
    successCount: number;
    failureCount: number;
    @Output() onUpload = new EventEmitter<void>();

    /**
     * 
     * 
     * @type {Loan}
     * @memberOf ViewDocumentPage
     */
    @Input() set selectedLoan(value: Loan) {
        if (value) {
            this.selectedFiles = [];
            this.currentLoan = value;
        }
    }
    // ngDoCheck() {
    //     this.removeUploadedFiles();
    // }

    constructor(private documentService: DocumentService,
        private googlePickerService: GooglePickerService,
        private ngZone: NgZone,
        private appSettings: AppSettings) {
    }

    /**
     * 
     * 
     * 
     * @memberOf DocumentSelectorComponent
     */
    uploadFileHandler() {
        $('#documentSelector').modal('hide');
        $('#fileUpload').click();
    }


    /**
     * 
     * 
     * @param {*} event
     * @returns
     * 
     * @memberOf UploadDocumentPage
     */

    fileChangeEvent(event: any) {
        this.fileCount = this.selectedFiles.length;
        let files = event.target.files;
        this.validationMessage = null;
        this.sameFileError = null;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                this.allSelectedFiles(files[i], i);
            }

            $('#fileUpload').val('');
            $('#documentSelector').modal('hide');

        }
    }

    allSelectedFiles(file: any, count: number) {
        // if (this.fileCount + count < 5) {
        this.initialValidationMessage = null;
        if (!GlobalConstants.fileUploadTypes.find(x => x === file.type) || file.name.includes('.jfif')) {
            this.initialValidationMessage = GlobalConstants.fileTypeRestrictionValidationMessage;
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
                this.addFile();
                this.fileCount++;
            }.bind(this), false);
            reader.readAsDataURL(file);
        } else {
            this.initialValidationMessage = GlobalConstants.fileSizeLimitValidationMessage;
        }
        // } else {
        //     this.validationMessage = 'More than 5 files are not allowed';
        // }
    }

    /**
     * 
     * this method will add each file to the selectedfiles array.
     * 
     * @memberOf UploadDocumentPage
     */
    addFile() {
        this.selectedFiles.push({
            lastModifiedDate: this.selectedFile.lastModifiedDate,
            name: this.selectedFile.name,
            size: this.selectedFile.size,
            type: this.selectedFile.type,
            showConditions: false,
            uploadStatus: UploadStatus.InProgress,
            content: this.selectedFile.content,
            loanNumber: this.currentLoan.loan_num,
            is_selected: true
        });
    }


    /**
     * 
     * button click event handler for uploading all the selected documnents
     * 
     * @memberOf UploadDocumentPage
     */
    onUploadDocumentClick() {
        this.validationMessage = '';
        this.isUploadClicked = true;
        this.initialValidationMessage = null;
        this.successCount = 0;
        this.failureCount = 0;
        let i = 0;
        let uploadFileTasks = this.selectedFiles.map(eachFile => this.uploadDocument(eachFile));
        Observable.forkJoin(uploadFileTasks)
            .subscribe(taskResponse => {
                taskResponse.forEach(eachTask => {
                    if (eachTask && eachTask.data.upload_status === 'Success') {
                        this.selectedFiles[i].uploadStatus = UploadStatus.Successful;
                        this.successCount += 1;
                    }
                    i += 1;
                    this.validateErrorMessage();
                });
                this.onUpload.emit();
                this.isUploadClicked = false;
            }, error => {
                this.selectedFiles[i].uploadStatus = UploadStatus.Failure;
                this.failureCount += 1;
                i += 1;
                this.validateErrorMessage();
            });
        /**
         * Reset the upload control
         */
        $('#fileUpload').val('');
    }

    /**
     * Displays the error message based on uploaded response
     * 
     * 
     * @memberOf UploadDocumentPage
     */
    validateErrorMessage() {
        console.log(this.failureCount);
        if (this.successCount === this.selectedFiles.length) {
            this.selectedFiles = [];
            this.validationMessage = 'Your Document Upload was successful';
            this.isUploadClicked = false;
            this.isRetryVisible = false;
        }
        if ((this.successCount < this.selectedFiles.length) && ((this.successCount + this.failureCount) === this.selectedFiles.length)) {
            this.selectedFiles = this.selectedFiles.filter(each => each.uploadStatus === UploadStatus.Failure);
            this.validationMessage = 'Upload Failed. Please retry.';
            this.isRetryVisible = true;
            this.isUploadClicked = false;
        }
    }

    /**
     * Upload the document from dropbox
     * 
     * 
     * @memberOf UploadDocumentPage
     */
    uploadFromDropBox() {
        this.initialValidationMessage = null;
        this.validationMessage = null;
        let self = this;
        let options = {

            // Required. Called when a user selects an item in the Chooser.
            success: function (files: any[]) {
                self.validFiles = files.filter(e => e.bytes <= GlobalConstants.fileUploadSieLimit);
                if (self.validFiles.length !== files.length) {
                    self.ngZone.run(() => {
                        self.initialValidationMessage = GlobalConstants.fileSizeLimitValidationMessage;
                    });
                }
                if (self.validFiles.length > 0) {
                    let downloadTasks = self.validFiles.map(e => self.documentService.getDocumentFromDropBox(e.link));
                    let index = 0;
                    Observable.forkJoin(downloadTasks)
                        .subscribe(result => {
                            result.map(each => {
                                let blob = each.json();
                                let fileReader = new FileReader();
                                fileReader.addEventListener('load', function () {
                                    let header = ';base64,';
                                    let content = fileReader.result;
                                    let headerIndex = content.indexOf(header, header.length);
                                    let base64 = content.substring(headerIndex).replace(header, '');
                                    self.selectedFile = {
                                        lastModifiedDate: new Date(),
                                        name: self.validFiles[index].name,
                                        size: self.validFiles[index].bytes,
                                        type: self.validFiles[index].name.substring(self.validFiles[index].name.indexOf('.') + 1),
                                        showConditions: false,
                                        uploadStatus: UploadStatus.InProgress,
                                        content: base64,
                                        is_selected: true,
                                        loanNumber: self.currentLoan.loan_num
                                    };
                                    self.addFile();
                                    index++;
                                });
                                fileReader.readAsDataURL(blob);
                            });
                        });
                }
            },
            // Optional. "preview" (default) is a preview link to the document for sharing,
            // "direct" is an expiring link to download the contents of the file. For more
            // information about link types, see Link types below.
            linkType: 'direct', // or "preview"

            // Optional. A value of false (default) limits selection to a single file, while
            // true enables multiple file selection.
            multiselect: true, // or true

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
     * Remove each selected file on button click
     * 
     * @param {FileInfo} file
     * 
     * @memberOf UploadDocumentPage
     */
    removeFile(file: FileInfo) {
        if (!this.isUploadClicked) {
            file.is_selected = false;
            this.selectedFiles = this.selectedFiles.filter(e => e.is_selected === true);
            this.initialValidationMessage = null;
            this.validationMessage = null;
            if (this.selectedFiles.length === 0) {
                this.isRetryVisible = false;
            }
        }
    }

    /**
     * 
     * Call the upload document service
     * @private
     * @param {FileInfo} file
     * 
     * @memberOf UploadDocumentPage
     */
    private uploadDocument(file: FileInfo): Observable<ApiResponse<UploadDocumentResponse>> {
        return this.documentService.uploadDocument({
            document_name: file.name.replace(/\.[^/.]+$/, ''),
            file_name: file.name,
            image: file.content,
            loan_num: file.loanNumber,
            need_ids: [],
            type: 'condition'
        });
    }

    /**
     * 
     * 
     * 
     * @memberOf UploadDocumentPage
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
            this.initialValidationMessage = null;
            this.validationMessage = null;
            if (err) {

            }
            if (file) {
                if (file.sizeBytes > GlobalConstants.fileUploadSieLimit) {
                    self.ngZone.run(() => {
                        self.initialValidationMessage = GlobalConstants.fileSizeLimitValidationMessage;
                    });
                } else {
                    this.documentService.getDocumentFromGoogleDrv(googleDrive.driveApi + file.id, oauthToken)
                        .subscribe(response => {
                            let downloadTask = self.documentService.
                                getDocumentFromGoogleDrv(response['downloadUrl'] + '&access_token=' + oauthToken, null);
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
                                            is_selected: true,
                                            loanNumber: self.currentLoan.loan_num,
                                        };
                                        self.addFile();
                                    });
                                });
                                fileReader.readAsDataURL(blob);
                            });
                        });
                }
            }
        });
    }

    getdroppedFiles(files: File) {
        this.validationMessage = '';
        this.initialValidationMessage = '';
        if (files) {
            this.allSelectedFiles(files, 1);
        }
        $('#documentSelector').modal('hide');
    }
}


