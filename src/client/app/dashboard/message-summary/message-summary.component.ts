import { Component, Input } from '@angular/core';

import {DashboardResource} from './../dashboard.resource';
/**
 * 
 */
@Component({
    selector: 'sl-message-summary',
    templateUrl: './message-summary.component.html'
})
export class MessageSummaryComponent {
    resource: { [key: string]: string } = DashboardResource.messageSummary;
    @Input() messageCount: string;
}
