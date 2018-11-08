/**
 * Routing configuration for Checklist
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContactPage } from './contact.page';
import { AuthorizationGuard } from '../../././sl-ui-framework/auth/shared/guard';

const contactRoutes: Routes = [
    {
        path: 'contact', component: ContactPage,
        canActivate: [AuthorizationGuard]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(contactRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class ContactRoutingModule {

}
