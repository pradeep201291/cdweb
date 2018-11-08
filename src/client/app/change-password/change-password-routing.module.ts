/**
 * Routing configuration for Change Password Page
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChangePasswordPage } from './change-password.page';
import { AuthorizationGuard } from '../../././sl-ui-framework/auth/shared/guard';

const changePasswordRoutes: Routes = [
    {
        path: 'changepassword', component: ChangePasswordPage,
        canActivate: [AuthorizationGuard]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(changePasswordRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class ChangePasswordRoutingModule {

}
