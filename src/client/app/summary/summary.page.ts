import { Component, OnInit, OnDestroy, NgZone, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { SummaryService } from './summary.service';
import { NotificationService } from './notification.service';

import { LoanInfo } from './models/loan.response.model';
import { MenuService } from './../../sl-ui-framework/layout/service/menu.service';

import { AuthenticationService } from './../../sl-ui-framework/auth/auth.service';
import { GlobalConstants } from './../core/global-constant/global-constant';
import { MessageService } from './../message/shared/message-page.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { EsignModalService } from '../shared/service/esign-modal.service';
import { TaskInfo, Loan, TaskType } from './summary.typedef';
import { WidgetRenderService } from './../shared/service/widget-render.service';
import { FormWidgetData } from './summary.typedef';
import { StateProviderService } from './../core/state-provider.service';
import { DataStoreService } from './../../sl-ui-framework/infrastructure/data-store/data-store.service';
import { SummaryResource } from './summary.resource';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { PrivateLabelService } from '../shared/service/private-label.service';
import * as _ from 'lodash';
declare var $: any;
declare var window: any;
const defaultDomain = 'brkr.tavant.com';
@Component({
    selector: 'sl-summary',
    templateUrl: './summary.page.html',
    providers: [SummaryService, NotificationService]
})
export class SummaryPage
    implements OnInit, OnDestroy {
    private userName: string;
    tag_line: string;
    text: string = 'If you need any assistance please contact';
    selectedIndex = -1;
    taskList: TaskInfo[] = [];
    currentTask: TaskInfo;
    currentLoan: Loan;
    myLoans: LoanInfo[];
    private selectedLoan: LoanInfo;
    value: LoanInfo[];
    selectedLoanNumber: string;
    loanCount: number;
    trustedEsignUrl: SafeResourceUrl;
    formWidgetData: FormWidgetData;
    canNavigate: boolean;
    isDropdownClicked: boolean = false;
    esignAccessToken: string;
    hasTrademark: boolean;
    private componentDestroyed: Subject<void> = new Subject<void>();
    /**
     * Creates an instance of SummaryPage.
     * 
     * @param {SummaryService} summaryService
     * @param {AuthenticationService} authService
     * @param {LoanService} loanService
     * @param {NotificationService} notificationService
     * @param {MenuService} menuService
     * @param {DomSanitizer} sanitizer
     * @param {EsignModalService} esignModalService
     * @param {zone} NgZone
     * @param {WidgetRenderService} widgetRenderService
     * @param {Router} router
     * @memberOf SummaryPage
     */
    constructor(private summaryService: SummaryService,
        private authService: AuthenticationService,
        private messageService: MessageService,
        private notificationService: NotificationService,
        private menuService: MenuService,
        private sanitizer: DomSanitizer,
        private esignModalService: EsignModalService,
        private zone: NgZone,
        private widgetRenderService: WidgetRenderService,
        private router: Router,
        private stateProviderService: StateProviderService,
        private dataStoreService: DataStoreService,
        private lblService: PrivateLabelService
    ) {

    }


    /**
     * Gets the summary details for the loan and aggregates the results.
     * 
     * 
     * @memberOf SummaryPage
     */
    getSummaryForLoan() {
        this.taskList = [];
        this.currentLoan = null;
        this.currentTask = null;
        if (this.selectedLoan) {
            this.summaryService.getSummaryForLoan(this.selectedLoan.loan_num, this.selectedLoan.src)
                .subscribe((summaryResponse) => {
                    let validTasks = summaryResponse.data.needs_list
                        .filter(item => item.action.toUpperCase() === 'UPLOAD' ||
                            item.action.toUpperCase() === 'ESIGN' ||
                            item.action.toUpperCase() === 'FORMFREE');
                    if (validTasks.length > 0) {
                        this.taskList = validTasks.map(eachTask => {
                            return {
                                type: eachTask.action.toUpperCase() === 'UPLOAD' ?
                                    TaskType.UploadTask : eachTask.action.toUpperCase() === 'ESIGN' ?
                                        TaskType.eSignTask : TaskType.assetsCheckTask,
                                isActive: false,
                                actionUrl: eachTask.action_url,
                                need_id: eachTask.need_id,
                                borrower_id: eachTask.borrower_id,
                                status: eachTask.status,
                                description: eachTask.description,
                                comments: eachTask.comments,
                                borrower: eachTask.borrower,
                                loan: {
                                    address: `${this.selectedLoan.prop_address}, 
                                        ${this.selectedLoan.prop_city}, 
                                        ${this.selectedLoan.prop_state},  
                                        ${this.selectedLoan.prop_zip}`,
                                    closingDate: new Date(),
                                    status: summaryResponse.data.status.status_text,
                                    loan_num: this.selectedLoan.loan_num,
                                    labelKey: summaryResponse.data.status.label,
                                    labelValue: summaryResponse.data.status.text,
                                    contact: summaryResponse.data.contact_list &&
                                        summaryResponse.data.contact_list.contacts &&
                                        summaryResponse.data.contact_list.contacts.length > 0
                                        ? summaryResponse.data.contact_list.contacts[0]
                                        : null
                                }
                            };
                        });
                        /**
                        * @todo The tasklist is minimized with distint loan object
                        */
                        let accCheckTask = this.taskList.filter(x => x.type === TaskType.assetsCheckTask);
                        let esignTask = this.taskList.filter(x => x.type === TaskType.eSignTask);
                        let uploadTask = this.taskList.filter(x => x.type === TaskType.UploadTask);
                        if (uploadTask && uploadTask.length > 0) {
                            this.taskList = [uploadTask[0]].concat(esignTask).concat(accCheckTask);
                        } else {
                            this.taskList = esignTask.concat(accCheckTask);
                        }
                    } else {

                        this.taskList.push({
                            type: TaskType.NoPendingTasks,
                            isActive: false,
                            actionUrl: null,
                            need_id: null,
                            borrower_id: null,
                            status: null,
                            description: null,
                            comments: null,
                            borrower: null,
                            loan: {
                                address: `${this.selectedLoan.prop_address}, 
                                    ${this.selectedLoan.prop_city}, 
                                    ${this.selectedLoan.prop_state},  
                                    ${this.selectedLoan.prop_zip}`,
                                closingDate: new Date(),
                                status: summaryResponse.data.status.status_text,
                                loan_num: this.selectedLoan.loan_num,
                                labelKey: summaryResponse.data.status.label,
                                labelValue: summaryResponse.data.status.text,
                                contact: summaryResponse.data.contact_list &&
                                    summaryResponse.data.contact_list.contacts &&
                                    summaryResponse.data.contact_list.contacts.length > 0
                                    ? summaryResponse.data.contact_list.contacts[0]
                                    : null
                            }
                        });
                    }
                    if (this.taskList.length > 0) {
                        this.taskList[0].isActive = true;
                        this.currentTask = this.taskList[0];
                        this.currentLoan = this.taskList[0].loan;
                        this.selectedIndex = 0;
                    }
                });
        }

    }

    /**
     * Go to the slide
     * 
     * @param {number} index
     * 
     * @memberOf SummaryPage
     */
    goTo(index: number) {

        this.selectedIndex = index;
        this.currentTask = this.taskList[index];
    }
    /**
     * @description this.selectedLoan is set from localStorage to keep track of selected loan
     * 
     * 
     * @memberOf SummaryPage
     */
    ngOnInit() {
        /**
         * @author {karthik}
         * @description 
         * Get logged in user from local storage
         */
        window.sl = window.sl || {};
        window.sl.namespace = window.sl.namespace || {};
        window.sl.namespace.closeFormfreeCallback = this.closeFormfreeCallback.bind(this);
        window.sl.namespace.closeEsigncallback = this.closeEsigncallback.bind(this);
        let userObj = this.dataStoreService.getUserFromSession();
        userObj && userObj.FirstName ?
            this.userName = userObj.FirstName :
            this.userName = null;
        this.canNavigate = true;
        // Registered for esign modal pop up
        this.getEsignURL();
        // Registered for asset verification modal pop up
        this.showFormWidget();
        /**the tag line is picked from branding json */
        this.lblService.getPrivateLblResponse().subscribe(data => {
            let hostName = window.location.hostname;
            if (_.isUndefined(data[hostName])) {
                hostName = defaultDomain;
            }
            this.tag_line = data[hostName].data.tag_line;
            this.hasTrademark = data[hostName].data.hasTrademark;
        });
    }

    /**
     * @desc modal set to hide when the page gets destroyed
     * 
     * 
     * @memberOf SummaryPage
     */
    ngOnDestroy(): void {
        if ($('.modal-backdrop.in').is(':visible')) {
            $('.modal-backdrop.in').hide();
        }
        window.sl.namespace.closeFormfreeCallback = null;
        window.sl.namespace.closeEsigncallback = null;
        this.componentDestroyed.next();
        this.componentDestroyed.complete();
    }

    /**
     * @desc listener for esign url emitted from esign-document
     * 
     * 
     * @memberOf SummaryPage
     */
    getEsignURL() {
        this.trustedEsignUrl = null;
        this.esignAccessToken = null;
        this.esignModalService.getEsignTask().takeUntil(this.componentDestroyed).subscribe((item: TaskInfo) => {
            if (item && item !== null) {
                if (item.comments && item.comments !== '') {
                    if (item.comments.trim().toLowerCase() === SummaryResource.esign.comment.toLowerCase()) {
                        this.getEsignSSO(item);
                    }
                }
                this.trustedEsignUrl = this.sanitizer.bypassSecurityTrustResourceUrl(item.actionUrl);
                $('#esignDoc').modal({ backdrop: 'static', keyboard: false });
                $('#esignDoc .modal-body').append(`<script language="javascript"> if (window.addEventListener) { 
                    window.addEventListener('message', receiveMessage, false);}function receiveMessage(event) {
                        var origin = event.origin || event.originalEvent.origin; var data = JSON.parse(JSON.stringify(event.data));
                       if (origin !== 'https://stage.solex.com') return; if (data && data.type && 
                       (data.type.toLowerCase() =='signout'
                       || data.type.toLowerCase() =='complete' 
                       || data.type.toLowerCase() =='consentdeclined')) {
                           sl.namespace.closeEsigncallback();}}</script>`);
                $('#esignDoc').modal('show');
            }
        });
    }

    getEsignSSO(item: TaskInfo) {
        let payload = {
            BorrId: item.borrower_id,
            BorrFullName: item.borrower,
            BorrDTUrl: item.actionUrl,
            LoanNumber: item.loan.loan_num
        };

        this.summaryService.getEsignSso(payload).subscribe(response => {
            this.esignAccessToken = response.access_token;
            setTimeout(function () {
                $('#esignDoc').contents().find('form').submit();
            }, 0);
        }, error => {

        });
    }

    navigate(type: string) {
        if (this.canNavigate) {
            if (this.currentLoan && this.currentTask) {
                //  this.currentTask.isActive = false;
                let currentTaskIndex = this.taskList.findIndex(e => e === this.currentTask);
                if (type === 'prev') {
                    /**
                     * If the user wants to navigate to the previous slide
                     * 1. Check if the user is in the first slide, if so do nothing
                     * 2. Else set the task as the previous task
                     */
                    if (currentTaskIndex === 0) {
                        this.selectedIndex = currentTaskIndex;
                        return;
                    } else {
                        currentTaskIndex -= 1;
                        this.selectedIndex = currentTaskIndex;
                    }
                } else {
                    /**
                     * If the user wants to navigate to the next slide
                     * 1. Check if the user is in the last slide, if so do nothing.
                     * 2. Else set the task as the next task
                     */
                    if (currentTaskIndex === this.taskList.length - 1) {
                        this.selectedIndex = currentTaskIndex;
                        return;
                    } else {
                        currentTaskIndex += 1;
                        this.selectedIndex = currentTaskIndex;
                    }
                }
                this.canNavigate = false;

                // this.currentTask.isActive = true;
                // slide the carousel
                this.currentTask = this.taskList[currentTaskIndex];
                $('#myCarousel').carousel(type);
                this.attachCarouselCallBack();

            }
        }
    }

    private attachCarouselCallBack() {
        let self = this;
        $('#myCarousel').off('slid.bs.carousel');
        $('#myCarousel').on('slid.bs.carousel', function () {
            self.canNavigate = true;
        });
    }

    sendMail() {
        let url = 'mailto:' + this.currentLoan.contact.email;
        location.href = url;
    }


    /**
     * @desc esign modal - close event 
     * 
     * 
     * @memberOf SummaryPage
     */
    onEsignModalClose() {
        this.trustedEsignUrl = null;
        this.esignAccessToken = null;
        $('#esignDoc').modal('hide');
        this.getSummaryForLoan();
    }
    /**
     * @desc Show Asset verification modal
     * {widgetRenderService} Subscribed for form data pushed from asset verification component
     * 
     * @memberOf SummaryPage
     */
    showFormWidget() {
        this.widgetRenderService.getFormContent()
            .takeUntil(this.componentDestroyed)
            .subscribe((frmData: FormWidgetData) => {
                this.formWidgetData = frmData;
                let isContentValid = this.formWidgetData.widget && this.formWidgetData.widget !== '';
                /**
                 * Replaced new line and forward slash from external script content
                 */
                if (isContentValid) {
                    this.formWidgetData.widget = this.formWidgetData.widget
                        .replace(/\n/g, '').replace(/\\/g, '');
                }
                /**
                 * Modal dialog runs outside of angular
                 */
                $('#assetFormModal').modal({ backdrop: 'static', keyboard: false });
                if (isContentValid) {
                    $('#assetFormModal .modal-body').html(this.formWidgetData.widget);
                    $('#assetFormModal .modal-body').append('<script language="javascript">function AC_Complete()' +
                        '{sl.namespace.closeFormfreeCallback();}</script>');
                }
                $('#assetFormModal').modal('show');
            });
    }

    closeFormfreeCallback() {
        this.formWidgetModalClose();
    }
    /**
     * @desc Asset verification modal close
     * 
     * 
     * @memberOf SummaryPage
     */
    formWidgetModalClose() {
        $('#assetFormModal').modal('hide');
        if (this.formWidgetData.widget && this.formWidgetData.widget !== '') {
            /**
             * Reload page contents post closing of modal dialog
             */
            this.getSummaryForLoan();
        }
    }
    /**
     * @desc set loan officer name for further filter in message page load
     * 
     * @param {string} name
     * 
     * @memberOf SummaryPage
     */
    goToMessage(name: string) {
        // this.router.navigate(['/message', { name: name }]);
        this.stateProviderService.loanOfficerName = name;
        this.router.navigate(['/message']);
    }

    /**
     * To show and hide the options on click of loan selector dropdown.
     */
    onLoanDropDownClicked(event: any) {
        this.isDropdownClicked = !this.isDropdownClicked;
        if (event) {
            event.stopPropagation();
        }
    }

    /**
     * 
     * Hide loan selector dropdown if clicked anywhere.
     * 
     * 
     * @memberOf HeaderComponent
     */
    @HostListener('document:click', ['$event'])
    hideSettings(event: any) {
        this.isDropdownClicked = false;
    }

    closeEsigncallback() {
        this.onEsignModalClose();
    }

    onLoanSelected(selectedLoan: LoanInfo) {
        this.selectedLoan = selectedLoan;
        this.selectedLoanNumber = this.selectedLoan.loan_num;
        sessionStorage.setItem(GlobalConstants.currentLoan, JSON.stringify(this.selectedLoan));
        this.getSummaryForLoan();
        this.canNavigate = true;
    }
}

