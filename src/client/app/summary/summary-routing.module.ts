/**
 * Routing configuration for Checklist
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SummaryPage } from './summary.page';
import { AuthorizationGuard } from '../../././sl-ui-framework/auth/shared/guard';

const summaryRoutes: Routes = [
    {
        path: 'summary',
        component: SummaryPage,
        canActivate: [AuthorizationGuard]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(summaryRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class SummaryRoutingModule {

}
