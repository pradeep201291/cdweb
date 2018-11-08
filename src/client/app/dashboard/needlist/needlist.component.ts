import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';

import { LoanInfo } from './../../../sl-ui-framework/layout/action-bar/models/loan.response.model';
import { Need } from './needlist.typedef';
import { StateProviderService } from './../../core/state-provider.service';
import { DashboardResource } from './../dashboard.resource';
import { EsignModalService } from './../../shared/service/esign-modal.service';
import { DashboardService } from '../dashboard.service';
import { WidgetRenderService } from './../../shared/service/widget-render.service';

import { FormWidgetData, GetFormWidgetResponse } from '../dashboard.typedef';
import { PagerService } from './../../../sl-ui-framework/infrastructure/pagination/pagination.service';

declare var $: any;

@Component({
    selector: 'sl-need-list',
    templateUrl: 'needlist.component.html'
})
export class NeedListComponent implements OnInit {
    resource: { [key: string]: string } = DashboardResource.needlist;
    @Input() selectedLoan: LoanInfo;
    @Input() needList: Need[];

    filteredNeedlist: Need[] = [];

    showOpenItems: boolean = true;
    sortBy: string = '';
    sortOrder: string = '';
    viewComment: string;
    hideModal: boolean = true;
    private openedPopover: string;

    /**
     * 
     * 
     * @type {Need[]}
     * @memberOf NeedListComponent
     */
    pagedNeedlist: Need[] = [];
    /**
     * currentPage
     * 
     * @type {number}
     * @memberOf NeedListComponent
     */
    currentPage: number = 0;

    /**
     * pager
     * 
     * @type {*}
     * @memberOf NeedListComponent
     */
    pager: any = {};
    /**
     * pagedItems
     * 
     * @type {any[]}
     * @memberOf ViewDocumentPage
     */
    pagedItems: any[];

    private formData: FormWidgetData;

    /* The Constructor
        * @param {StateProviderService} state - state management service
    */
    constructor(private state: StateProviderService,
        private route: Router,
        private esignModalService: EsignModalService,
        private dashboardService: DashboardService,
        private pagerService: PagerService,
        private widgetRenderService: WidgetRenderService) { }
    ngOnInit() {
        this.mapAndFilter();
    }
    /**
     * Map and filter items
     */
    mapAndFilter() {
        this.filteredNeedlist = this.needList.filter(a => a.status === 'Open' || (a.status === 'In Progress' && a.type === 'formfree'));
        // this.sortNeeds('due_date', 'asc');
        if (this.filteredNeedlist && this.filteredNeedlist.length > 0) {
            this.setPage(1);
        }
    }

    /**
     * Sort items
     */
    sortNeeds(field: string, sortOrder: string) {
        this.sortBy = field;
        this.sortOrder = sortOrder;

        if (field === 'borrower') {
            this.filteredNeedlist = _.orderBy(this.filteredNeedlist, [(e) => e.borrower.toLowerCase()], [sortOrder]);
        } else {
            this.filteredNeedlist = _.orderBy(this.filteredNeedlist, [field], [sortOrder]);
        }
        if (this.filteredNeedlist && this.filteredNeedlist.length > 0) {
            this.setPage(1);
        }
    }

    /**
     * Filter items based on type
     */
    filterItems(type: string) {
        this.pagedNeedlist = [];
        this.hideModal = true;
        if (type === 'open') {
            this.showOpenItems = true;
            this.filteredNeedlist = this.needList.filter(a => a.status === 'Open' ||
                (a.status === 'In Progress' && a.type.toLowerCase() === 'formfree'));
        } else {
            this.showOpenItems = false;
            this.filteredNeedlist = this.needList.filter(a => a.status !== 'Open' &&
                (a.type.toLowerCase() !== 'formfree' || a.status !== 'In Progress'));
        }
        this.setPage(1);
        // this.sortNeeds('due_date', 'asc');

    }

    /**
     * @desc need_id is taken from the condition binding and passed as parm on action click
     * Navigate to the upload document page.
     * 
     * @memberOf SummaryUploadComponent
     */
    uploadDocument(needId: string) {
        this.state.needListUploadEntryRoute = '/dashboard';
        /**Need Id is assigned to StateProviderService - {NeedId} property */
        this.state.NeedId = needId;
        this.route.navigate(['upload']);
    }

    /**
     * 
     * @desc url emitted to dashboard
     * @param {string} url
     * 
     * @memberOf NeedListComponent
     */
    getEsignURL(task: Need) {
        this.esignModalService.setTask(task);
    }
    /**
     * @desc shows form free widget
     * 
     * @param {string} vod_Id
     * @param {string} borrowerIndex
     * 
     * @memberOf NeedListComponent
     */
    showWidget(vod_Id: string, borrowerIndex: string) {
        let isValid = this.selectedLoan.loan_num && this.selectedLoan.loan_num !== '' &&
            vod_Id && vod_Id !== '' && borrowerIndex && borrowerIndex !== '';
        if (isValid) {
            this.dashboardService.getWidgetFormData(
                {
                    LoanNumber: this.selectedLoan.loan_num,
                    BorrowerIndex: borrowerIndex,
                    VOD_ID: vod_Id,
                    maxWidth: DashboardResource.modaldialog.bodyDimension.maxWidth,
                    maxHeight: DashboardResource.modaldialog.bodyDimension.maxHeight
                })
                .subscribe((formWidgetResponse: GetFormWidgetResponse) => {
                    this.formData = formWidgetResponse.Body;
                    if (this.formData && this.formData != null) {
                        this.widgetRenderService.setWidgetContent(this.formData);
                    }
                }, error => {
                    this.widgetRenderService.setWidgetContent({
                        GetEnrollmentWidgetResult: false,
                        widget: '',
                        errorMessage: DashboardResource.modaldialog.errormessage
                    });
                });
        }
    }

    /**
     * Show additional comments
     * 
     * @param {Need} need
     * 
     * @memberOf NeedListComponent
     */
    showComments(need: Need) {
        this.viewComment = need.comments;
        this.hideModal = false;
    }

    /**
     * Hide the view comments pop up
     * 
     * 
     * @memberOf NeedListComponent
     */
    hidePover() {
        if (this.openedPopover && this.openedPopover !== '') {
            $('#' + this.openedPopover).popover('destroy');
            this.openedPopover = '';
        }
    }

    private stopEventPropagation() {
        if (window.event) {
            window.event.stopPropagation();
        }
    }

    /**
     * Show additional comments pop up
     * 
     * @param {string} id
     * @param {Need} need
     * @returns
     * 
     * @memberOf NeedListComponent
     */
    showPopup(id: string, need: Need) {
        if (this.openedPopover === id) {
            this.stopEventPropagation();

            return;
        }
        this.hidePover();
        this.viewComment = need.comments;
        $('[data-toggle=popover]').popover({
            html: true,
            content: function () {
                return $('#comments-popover').html();
            }
        });
        setTimeout((function () {
            $('#' + id).popover('show');
        }).bind(this), 500);
        this.openedPopover = id;
        this.stopEventPropagation();

        $('body').on('click', 'span#popover-hide', function () {
            this.hidePover();
        }.bind(this));

        $('previous').on('click', 'span#popover-hide', function () {
            this.hidePover();
        }.bind(this));

        $('next').on('click', 'span#popover-hide', function () {
            this.hidePover();
        }.bind(this));

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
        this.hidePover();
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
        if (page < 1) {
            return;
        }
        this.pager = this.pagerService.getPager(this.filteredNeedlist.length, page, withinTheFrame);
        if (page > this.pager.totalPages) {
            return;
        }
        this.pagedNeedlist = this.filteredNeedlist.slice(this.pager.startIndex, this.pager.endIndex + 1);
        this.currentPage = this.pager.currentPage;
    }
}
