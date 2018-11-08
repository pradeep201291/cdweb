import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { SummaryService } from '../summary.service';
import { WidgetRenderService } from './../../shared/service/widget-render.service';

import { GetFormWidgetResponse } from '../models/asset-verification.response.model';
import { TaskInfo, FormWidgetData } from '../summary.typedef';
import { LoanInfo } from './../models/loan.response.model';
import { SummaryResource } from '../summary.resource';

/**
 * 
 * 
 * @export
 * @class AssetVerificationComponent
 */
@Component({
    selector: 'sl-asset-verification',
    templateUrl: './asset-verification.component.html',
})
export class AssetVerificationComponent {
    /**
     * 
     * 
     * @type {TaskInfo[]}
     * @memberOf AssetVerificationComponent
     */
    @Input() taskInfo: TaskInfo[] = [];
    /**
     * 
     * 
     * @type {LoanInfo}
     * @memberOf AssetVerificationComponent
     */
    @Input() selectedLoan: LoanInfo;

    /**
     * 
     * 
     * @private
     * @type {FormWidgetData}
     * @memberOf AssetVerificationComponent
     */
    private formData: FormWidgetData;

    /**
     * Creates an instance of AssetVerificationComponent.
     * 
     * @param {SummaryService} summaryService
     * @param {WidgetRenderService} widgetRenderService
     * @param {Router} route
     * 
     * @memberOf AssetVerificationComponent
     */
    constructor(private summaryService: SummaryService,
        private widgetRenderService: WidgetRenderService,
        private route: Router) {

    }
    /**
     * 
     * 
     * @param {string} vod_Id
     * @param {string} borrowerIndex
     * 
     * @memberOf AssetVerificationComponent
     */
    showWidget(vod_Id: string, borrowerIndex: string) {
        let isValid = this.selectedLoan.loan_num && this.selectedLoan.loan_num !== '' &&
            vod_Id && vod_Id !== '' && borrowerIndex && borrowerIndex !== '';
        if (isValid) {
            this.summaryService.getWidgetFormData(
                {
                    LoanNumber: this.selectedLoan.loan_num,
                    BorrowerIndex: borrowerIndex,
                    VOD_ID: vod_Id,
                    maxWidth: SummaryResource.modaldialog.bodyDimension.maxWidth,
                    maxHeight: SummaryResource.modaldialog.bodyDimension.maxHeight
                })
                .subscribe((formWidgetResponse: GetFormWidgetResponse) => {
                    this.formData = formWidgetResponse.Body;
                    if (this.formData && this.formData != null) {
                        this.widgetRenderService.setFormContent(this.formData);
                    }
                }, error => {
                    this.widgetRenderService.setFormContent({
                        GetEnrollmentWidgetResult: false,
                        widget: '',
                        errorMessage: SummaryResource.modaldialog.errormessage
                    });
                });
        }
    }
    /**
     * @desc Routed to dashboard page
     * 
     * 
     * @memberOf AssetVerificationComponent
     */
    loadDashboard() {
        this.route.navigate(['/dashboard']);
    }
}
