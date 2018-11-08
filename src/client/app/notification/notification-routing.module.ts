/**
 * Routing configuration for Checklist
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotificationPage } from './notification.page';
import { AuthorizationGuard } from '../../././sl-ui-framework/auth/shared/guard';
const notificationRoutes: Routes = [
    {
        path: 'notification', component: NotificationPage,
        canActivate: [AuthorizationGuard]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(notificationRoutes)
    ],
    exports: [
        RouterModule
    ],
})
export class NotificationRoutingModule { }
