/**
 * Routing configuration for Dashboard
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashBoardPage } from './dashboard.page';
import { AuthorizationGuard } from '../../././sl-ui-framework/auth/shared/guard';

const dashboardRoutes: Routes = [
    {
        path: 'dashboard', component: DashBoardPage,
        canActivate: [AuthorizationGuard]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(dashboardRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class DashboardRoutingModule {

}
