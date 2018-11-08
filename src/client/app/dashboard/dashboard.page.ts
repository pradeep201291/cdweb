import { Component, OnInit, OnDestroy, NgZone, ViewChild } from '@angular/core';

import { DashboardService } from './dashboard.service';

import { LoanInfo } from './../shared/service/models/GetMyLoansResponse';
import { LoanData, } from './dashboard.typedef';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { EsignModalService } from './../shared/service/esign-modal.service';
import { WidgetRenderService } from './../shared/service/widget-render.service';
import { FormWidgetData } from './dashboard.typedef';
import { NeedListComponent } from './needlist/needlist.component';
import { Need } from './needlist/needlist.typedef';
import { DashboardResource } from './dashboard.resource';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
declare var window: any;
/**
 * The main Dashboard view component.
 * The service will be called from this component and will be shared to the child components
 */
@Component({
    selector: 'sl-dashboard',
    templateUrl: './dashboard.page.html',
    host: {
        '(document:click)': 'onClick($event)',
    },
})
export class DashBoardPage implements OnInit, OnDestroy {

    myLoans: LoanInfo[];
    dashboardDetails: LoanData;
    _selectedLoan: LoanInfo;
    trustedEsignUrl: SafeResourceUrl;
    formWidgetData: FormWidgetData;
    esignAccessToken: string;
    messageTxt: string;
    private componentDestroyed: Subject<void> = new Subject<void>();

    /**
     * Setter for selected loan
     */
    set selectedLoan(value: LoanInfo) {
        this._selectedLoan = value;
        // reset dashboard details;
        this.dashboardDetails = null;
        if (this.selectedLoan.loan_num !== '') {
            this.getDashboardDataForSelectedLoan();
        }
    }

    /**
     * Getter for selected loan
     */
    get selectedLoan() {
        return this._selectedLoan;
    }


    @ViewChild(NeedListComponent)
    private needListComponent: NeedListComponent;
    /**
     * The Constructor
     * @param {DashboardService} dashboardService - The Dashboard Service
     */
    constructor(private dashboardService: DashboardService,
        private sanitizer: DomSanitizer,
        private esignModalService: EsignModalService,
        private zone: NgZone,
        private widgetRenderService: WidgetRenderService) {
        this.myLoans = [];
    }

    /**
     * 
     * 
     * 
     * @memberOf DashBoardPage
     */
    ngOnInit() {
        window.sl = window.sl || {};
        window.sl.namespace = window.sl.namespace || {};
        window.sl.namespace.closeFormfreeCallback = this.closeFormfreeCallback.bind(this);
        window.sl.namespace.closeEsigncallback = this.closeEsigncallback.bind(this);
        // Registered for esign modal pop up
        this.getEsignURL();
        // Registered for asset verification modal pop up
        this.showFormWidget();
    }

    onClick() {
        if (this.needListComponent) {
            this.needListComponent.hidePover();
        }
    }
    /**
     * @desc modal set to hide when the page gets destroyed
     * 
     * 
     * @memberOf DashBoardPage
     */
    ngOnDestroy(): void {
        if ($('.modal-backdrop.in').is(':visible')) {
            $('.modal-backdrop.in').hide();
        }


        $('*').each(function () {
            // Bootstrap sets a data field with key `bs.popover` on elements that have a popover.
            // Note that there is no corresponding **HTML attribute** on the elements so we cannot
            // perform a search by attribute.
            let popover = $.data(this, 'bs.popover');
            if (popover) {
                $(this).popover('destroy');
            }
        });
        window.sl.namespace.closeFormfreeCallback = null;
        window.sl.namespace.closeEsigncallback = null;
        this.componentDestroyed.next();
        this.componentDestroyed.complete();
    }
    /**
     * Gets the dashboard details for the selcted loan.
     */
    getDashboardDataForSelectedLoan() {
        this.dashboardService.getDashboardData({ loan_num: this.selectedLoan.loan_num, src: this.selectedLoan.src })
            .subscribe(dashboardResponse => {
                this.dashboardDetails = dashboardResponse.data;
            });
    }
    /**
    * Subscription for loan selected
    */
    onLoanSelected(selectedLoan: LoanInfo) {
        this.selectedLoan = selectedLoan;
    }
    /**
     * @desc listener for esign url emitted from needlist
     * 
     * 
     * @memberOf DashBoardPage
     */
    getEsignURL() {
        this.esignAccessToken = null;
        this.trustedEsignUrl = null;
        this.messageTxt = null;
        this.esignModalService.getTask().takeUntil(this.componentDestroyed).subscribe((item: Need) => {
            if (item && item !== null) {
                if (item.comments && item.comments !== '' && item.action === 'ESign') {
                    if (item.comments.trim().toLowerCase() === DashboardResource.esign.comment.toLowerCase()) {
                        this.getEsignSSO(item);
                    }
                }
                item.action === 'Message' ? this.messageTxt = item.action_url :
                    this.trustedEsignUrl = this.sanitizer.bypassSecurityTrustResourceUrl(item.action_url);

                if (item.action === 'ESign') {
                    $('#esignModal').modal({ backdrop: 'static', keyboard: false });
                    $('#esignModal .modal-body').append(`<script language="javascript"> if (window.addEventListener) { 
                    window.addEventListener('message', receiveMessage, false);}function receiveMessage(event) {
                        var origin = event.origin || event.originalEvent.origin; var data = JSON.parse(JSON.stringify(event.data));
                       if (origin !== 'https://stage.solex.com') return; if (data && data.type && 
                       (data.type.toLowerCase() =='signout'
                       || data.type.toLowerCase() =='complete' 
                       || data.type.toLowerCase() =='consentdeclined')) {
                           sl.namespace.closeEsigncallback();}}</script>`);
                    $('#esignModal').modal('show');
                }

                if (item.action === 'Message') {
                    $('#notificationModal').modal('show');
                }
            }
        });
    }

    getEsignSSO(item: Need) {
        let payload = {
            BorrId: item.borrower_id,
            BorrFullName: item.borrower,
            BorrDTUrl: item.action_url,
            LoanNumber: this.selectedLoan.loan_num
        };

        this.dashboardService.getEsignSso(payload).subscribe(response => {
            this.esignAccessToken = response.access_token;
            setTimeout(function () {
                $('#esignModal').contents().find('form').submit();
            }, 0);
        }, error => {

        });
    }
    /**
     * @desc esign modal - close event 
     * 
     * 
     * @memberOf DashBoardPage
     */
    onEsignModalClose() {
        this.esignAccessToken = null;
        this.trustedEsignUrl = null;
        this.messageTxt = null;
        $('#esignModal').modal('hide');
        this.getDashboardDataForSelectedLoan();
    }
    /**
     * @desc Show Asset verification modal
     * {widgetRenderService} Subscribed for form data pushed from asset verification component
     * 
     * 
     * @memberOf DashBoardPage
     */
    showFormWidget() {
        this.widgetRenderService.getWidgetContent()
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
                $('#formWidgetModal').modal({ backdrop: 'static', keyboard: false });
                if (isContentValid) {
                    $('#formWidgetModal .modal-body').html(this.formWidgetData.widget);
                    $('#formWidgetModal .modal-body').append('<script language="javascript">function AC_Complete()' +
                        '{sl.namespace.closeFormfreeCallback();}</script>');
                }
                $('#formWidgetModal').modal('show');
            });
    }

    closeFormfreeCallback() {
        this.formWidgetModalClose();
    }
    /**
     * @desc Asset verification modal close
     * 
     * 
     * @memberOf DashBoardPage
     */
    formWidgetModalClose() {
        $('#formWidgetModal').modal('hide');
        if (this.formWidgetData.widget && this.formWidgetData.widget !== '') {
            /**
             * Reload page contents post closing of modal dialog
             */
            this.getDashboardDataForSelectedLoan();
        }
    }

    onNotificationModalClose() {
        this.messageTxt = null;
        $('#notificationModal').modal('hide');
    }
    onNotificationHandler() {
        this.messageTxt = DashboardResource.contact.noContactItems;
        $('#notificationModal').modal('show');
    }

    closeEsigncallback() {
        this.onEsignModalClose();
    }
}
