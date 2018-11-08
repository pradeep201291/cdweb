/**
 * Routing configuration for Checklist
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocumentPage } from './documents.page';
import { AuthorizationGuard } from '../../././sl-ui-framework/auth/shared/guard';

const notificationRoutes: Routes = [
    { path: 'documents', component: DocumentPage, canActivate: [AuthorizationGuard] },
];

@NgModule({
    imports: [
        RouterModule.forChild(notificationRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class DocumentRoutingModule { }
