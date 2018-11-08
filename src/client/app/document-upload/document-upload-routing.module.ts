/**
 * Routing configuration for document upload page
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocumentUploadPage } from './document-upload.page';
import { AuthorizationGuard } from '../../././sl-ui-framework/auth/shared/guard';

const documentUploadRoutes: Routes = [
    { path: 'upload', component: DocumentUploadPage, canActivate: [AuthorizationGuard] },
];

/**
 * 
 * 
 * @export
 * @class DocumentUploadRoutingModule
 */
@NgModule({
    imports: [
        RouterModule.forChild(documentUploadRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class DocumentUploadRoutingModule {

}
