import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 This component is the esign document component for the Summary page.
 */
@Component({
    selector: 'sl-summary-no-pending-item',
    templateUrl: './no-pending-item.component.html',
})


export class SummaryNoPendingComponent {

    /**
     * The constructor
     * @param {Router} route
     */
    constructor(private route: Router) { }

    loadDashboard() {
        this.route.navigate(['/dashboard']);
    }

}
