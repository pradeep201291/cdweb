/**
 * Document Upload Page
 */
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { Loan } from './models/loan.model';
import { ConditionListService } from './condition-list.service';
import { Condition } from './models/condition-list.model';
import { FileInfo, UploadStatus } from './models/file.model';
import { DocumentUploadService } from './document-upload.service';
import { DocumentSelectorComponent } from './document-selector/document-selector.component';
import { StateProviderService } from './../core/state-provider.service';
declare var $: any;
/**
 * 
 * 
 * @export
 * @class DocumentUploadPage
 */
@Component({
    selector: 'document-upload',
    templateUrl: './document-upload.page.html',
    providers: [ConditionListService]

})

export class DocumentUploadPage implements OnInit, OnDestroy {
    conditions: Condition[] = [];

    _selectedLoan: Loan;

    @ViewChild(DocumentSelectorComponent)
    private documentSelectorComponent: DocumentSelectorComponent;

    /**
         * Setter for selected loan
         */
    set selectedLoan(value: Loan) {
        this._selectedLoan = value;
        this.conditions = [];
        if (value && value.loan_num && value.src) {
            this.loadConditionsForLoan();
        }
    }

    /**
     * Getter for selected loan
     */
    get selectedLoan() {
        return this._selectedLoan;
    }

    onLoanSelected(selectedLoan: Loan) {
        this.selectedLoan = selectedLoan;
    }

    /**
     * Creates an instance of DocumentUploadPage.
     * 
     * @param {ActivatedRoute} route
     * @param {ConditionListService} conditionListService
     * @param {DocumentUploadService} uploadService
     * 
     * @memberOf DocumentUploadPage
     */
    constructor(private route: ActivatedRoute,
        private conditionListService: ConditionListService,
        private uploadService: DocumentUploadService,
        private state: StateProviderService) {

    }
    /**
     * 
     * 
     * 
     * @memberOf DocumentUploadPage
     */
    ngOnInit() {
    }

    /**
     * Loads the condition for the loan
     * 
     * 
     * @memberOf DocumentUploadPage
     */
    loadConditionsForLoan() {
        this.conditions = [];
        this.conditionListService.getNeedListData({ loan_num: this.selectedLoan.loan_num, src: this.selectedLoan.src })
            .subscribe(response => {
                let needList = response.data.needs_list;
                if (needList) {
                    needList = needList.filter((value) => {
                        if (value.action && value.status) {
                            return value.action.toUpperCase().trim() === 'UPLOAD' &&
                                value.status.toUpperCase().trim() === 'OPEN';
                        }
                    });
                    /**
                     * param {is_selected} boolean property is set according to the condition when 
                     * matching with selected need Id from dashboard need list
                     */
                    this.conditions = needList.map(each => {
                        return ({
                            additional_comments: '',
                            cond_comments: each.comments,
                            cond_desc: each.description,
                            cond_id: each.need_id,
                            date_added: each.create_date ? each.create_date.toString() : '',
                            responsible_party: each.borrower,
                            status: each.status,
                            type_id: each.type,
                            is_selected: (this.state.NeedId === each.need_id)
                        });
                    });
                }
            });
    }

    ngOnDestroy(): void {
        if ($('.modal-backdrop.in').is(':visible')) {
            $('.modal-backdrop.in').hide();
        }
        this.state.NeedId = '';
    }

    /**
     * 
     * 
     * @param {FileInfo} fileInfo
     * 
     * @memberOf DocumentUploadPage
     */
    upload(fileInfo: FileInfo) {
        let selectedConditionForFile = fileInfo.conditions.map(e => +e.cond_id);
        this.uploadService.uploadDocument({
            document_name: fileInfo.name.replace(/\.[^/.]+$/, ''),
            file_name: fileInfo.name,
            image: fileInfo.content,
            loan_num: fileInfo.loanNumber,
            need_ids: selectedConditionForFile,
            type: 'condition'
        }).subscribe(response => {
            if (response.data.upload_status === 'Success') {
                this.changeUploadStatus(UploadStatus.Successful);
                // this.loadConditionsForLoan();
            } else {
                this.changeUploadStatus(UploadStatus.Failure);
            }
        }, err => {
            this.changeUploadStatus(UploadStatus.Failure);
        });
    }

    close(isSuccess: boolean) {
        this.loadConditionsForLoan();
    }

    /**
     * 
     * 
     * @private
     * @param {UploadStatus} status
     * 
     * @memberOf DocumentUploadPage
     */
    private changeUploadStatus(status: UploadStatus) {
        if (this.documentSelectorComponent) {
            this.documentSelectorComponent.uploadStatus = status;
        }
    }
}
