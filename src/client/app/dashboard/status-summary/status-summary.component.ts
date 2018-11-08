import { Component, Input } from '@angular/core';

import { Status } from './../dashboard.typedef';
import { DashboardResource } from './../dashboard.resource';



/**
 * 
 */
@Component({
    selector: 'sl-status-summary',
    templateUrl: './status-summary.component.html'
})
export class StatusSummaryComponent {
    resource: { [key: string]: string } = DashboardResource.statusSummary;

    @Input() status: Status;

}
