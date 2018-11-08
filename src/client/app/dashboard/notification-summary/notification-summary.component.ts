import { Component, Input } from '@angular/core';

import {DashboardResource} from './../dashboard.resource';
/**
 * 
 */
@Component({
    selector: 'sl-notification-summary',
    templateUrl: './notification-summary.component.html'
})
export class NotificationSummaryComponent {
    resource: { [key: string]: string } = DashboardResource.notificationSummary;
    @Input() notificationCount: string;

    ngOnInit() {
    }
}
