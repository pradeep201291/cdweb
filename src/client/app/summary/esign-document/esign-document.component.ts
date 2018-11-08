import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { EsignModalService } from '../../shared/service/esign-modal.service';
import { TaskInfo } from '../summary.typedef';
/**
 This component is the esign document component for the Summary page.
 */
@Component({
    selector: 'sl-summary-esign-document',
    templateUrl: './esign-document.component.html',
})

export class SummaryEsignComponent implements OnInit {
    @Input() taskInfo: TaskInfo;

    constructor(private route: Router,
        private esignModalService: EsignModalService) { }


    esign() {
        this.esignModalService.setEsignTask(this.taskInfo);
        // let openSameTab = GlobalConstants.openSameTab;
        // window.open(this.esignUrl, openSameTab);
    }

    /**
     * On click of esign button we will be redirected to esign page
     */
    ngOnInit() {
        if (this.taskInfo && this.taskInfo.actionUrl !== null && !this.taskInfo.actionUrl.includes('http')) {
            this.taskInfo.actionUrl = 'http://' + this.taskInfo.actionUrl;
        } else {
            this.taskInfo.actionUrl = this.taskInfo.actionUrl;
        }
    }

    loadDashboard() {
        this.route.navigate(['/dashboard']);
    }

}
